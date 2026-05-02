import { tokenize, stem, stemTokens } from "./stemmer";
import { expandWithSynonyms } from "./synonyms";

// Поисковая модель: BM25-подобный ранжировщик с весами по полям.
// Поля: title (x4), shortAnswer (x2), keywords (x3), body (x1).
// Перед поиском токены запроса разворачиваются через словарь синонимов
// и стеммируются. Каждое поле документа индексируется так же.

export type IndexedDoc = {
  id: string;
  slug: string;
  title: string;
  shortAnswer: string;
  body: string;
  keywords: string[];
  category: { slug: string; title: string };
  urgency: number;
  // pre-stemmed token frequency maps per field
  fields: {
    title: Map<string, number>;
    shortAnswer: Map<string, number>;
    keywords: Map<string, number>;
    body: Map<string, number>;
  };
  totalLen: number;
};

export type SearchHit = {
  doc: IndexedDoc;
  score: number;
  highlights: string[]; // фрагменты с подсветкой
};

const FIELD_WEIGHTS: Record<keyof IndexedDoc["fields"], number> = {
  title: 4,
  shortAnswer: 2.2,
  keywords: 3,
  body: 1,
};

// IDF, рассчитанный на этапе построения индекса.
type IndexState = {
  docs: IndexedDoc[];
  // term -> кол-во документов, в которых встречается
  df: Map<string, number>;
  avgFieldLen: Record<keyof IndexedDoc["fields"], number>;
  N: number;
};

let INDEX: IndexState | null = null;

function makeFreqMap(text: string): Map<string, number> {
  const tokens = stemTokens(tokenize(text));
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  return m;
}

function makeFreqMapFromKeywords(keywords: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const k of keywords) {
    const tokens = stemTokens(tokenize(k));
    // ключевые слова считаем как фразы — каждый токен по +1
    for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  }
  return m;
}

export function buildIndex(
  raw: Array<{
    id: string;
    slug: string;
    title: string;
    shortAnswer: string;
    body: string;
    keywords: string[];
    category: { slug: string; title: string };
    urgency: number;
  }>,
): void {
  const docs: IndexedDoc[] = raw.map((r) => {
    const fields = {
      title: makeFreqMap(r.title),
      shortAnswer: makeFreqMap(r.shortAnswer),
      keywords: makeFreqMapFromKeywords(r.keywords),
      body: makeFreqMap(r.body),
    };
    const totalLen = [...Object.values(fields)].reduce(
      (acc, m) => acc + [...m.values()].reduce((a, b) => a + b, 0),
      0,
    );
    return { ...r, fields, totalLen };
  });

  const df = new Map<string, number>();
  for (const d of docs) {
    const seen = new Set<string>();
    for (const f of Object.values(d.fields)) {
      for (const term of f.keys()) seen.add(term);
    }
    for (const term of seen) df.set(term, (df.get(term) || 0) + 1);
  }

  const avgFieldLen = {
    title: 0,
    shortAnswer: 0,
    keywords: 0,
    body: 0,
  } as Record<keyof IndexedDoc["fields"], number>;
  for (const d of docs) {
    for (const k of Object.keys(d.fields) as (keyof IndexedDoc["fields"])[]) {
      const len = [...d.fields[k].values()].reduce((a, b) => a + b, 0);
      avgFieldLen[k] += len;
    }
  }
  for (const k of Object.keys(avgFieldLen) as (keyof IndexedDoc["fields"])[]) {
    avgFieldLen[k] = avgFieldLen[k] / Math.max(docs.length, 1);
  }

  INDEX = { docs, df, avgFieldLen, N: docs.length };
}

export function isIndexBuilt(): boolean {
  return INDEX !== null;
}

const K1 = 1.4;
const B = 0.6;

function bm25Term(
  tf: number,
  fieldLen: number,
  avgLen: number,
  df: number,
  N: number,
): number {
  if (tf === 0) return 0;
  const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
  const denom = tf + K1 * (1 - B + B * (fieldLen / Math.max(avgLen, 1)));
  return idf * ((tf * (K1 + 1)) / Math.max(denom, 0.001));
}

function snippet(body: string, queryTokens: string[]): string {
  if (!body) return "";
  const lower = body.toLowerCase();
  let bestPos = -1;
  let bestScore = 0;
  for (const qt of queryTokens) {
    const stemmed = stem(qt);
    // ищем первое вхождение по подстроке стеммы (грубая, но рабочая эвристика)
    const pos = lower.indexOf(stemmed);
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos;
      bestScore = stemmed.length;
    }
  }
  const start = Math.max(0, (bestPos === -1 ? 0 : bestPos) - 80);
  const end = Math.min(body.length, start + 220);
  let s = body.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) s = "… " + s;
  if (end < body.length) s = s + " …";
  return s;
}

export function search(query: string, limit = 8): SearchHit[] {
  if (!INDEX || !query.trim()) return [];
  const rawTokens = tokenize(query);
  if (!rawTokens.length) return [];
  const expanded = expandWithSynonyms(rawTokens);
  const stems = [...new Set(stemTokens(expanded))];

  const { docs, df, avgFieldLen, N } = INDEX;
  const hits: SearchHit[] = [];

  for (const doc of docs) {
    let score = 0;
    let matchedTerms = 0;

    for (const term of stems) {
      const dfVal = df.get(term) || 0;
      if (!dfVal) continue;
      let termScore = 0;
      for (const fieldName of Object.keys(
        doc.fields,
      ) as (keyof IndexedDoc["fields"])[]) {
        const tf = doc.fields[fieldName].get(term) || 0;
        if (!tf) continue;
        const fieldLen = [...doc.fields[fieldName].values()].reduce(
          (a, b) => a + b,
          0,
        );
        termScore +=
          FIELD_WEIGHTS[fieldName] *
          bm25Term(tf, fieldLen, avgFieldLen[fieldName], dfVal, N);
      }
      if (termScore > 0) {
        matchedTerms += 1;
        score += termScore;
      }
    }

    // Бонус за покрытие — много токенов запроса нашлись в документе
    if (matchedTerms > 0) {
      const coverage = matchedTerms / stems.length;
      score *= 0.6 + coverage * 0.6;
      // мягкий буст по urgency: при равенстве score — выше всплывают срочные темы
      score += doc.urgency * 0.05;
      hits.push({ doc, score, highlights: [snippet(doc.body, rawTokens)] });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

export function suggestSpecializations(hits: SearchHit[]): string[] {
  // По топ-3 хитов считаем самые частые специализации
  const counts = new Map<string, number>();
  for (const h of hits.slice(0, 3)) {
    const key = h.doc.category.slug;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const arr = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return arr.map(([slug]) => slug);
}
