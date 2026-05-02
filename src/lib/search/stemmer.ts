// Простой русский стеммер по правилам Портера (упрощённая версия).
// Цель: привести "уволили", "уволят", "увольнение" к похожему виду,
// чтобы поиск по запросу "уволили" находил статью со словом "увольнение".

const VOWEL = /[аеёиоуыэюя]/i;
const PERFECTIVE = /(в|вши|вшись)$/;
const ADJECTIVE =
  /(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/;
const PARTICIPLE =
  /(ивш|ывш|ующ|вш|ем|нн|вш|ющ|ющи|ющу|ющ)$/;
const REFLEXIVE = /(ся|сь)$/;
const VERB =
  /(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ить|ыть|ишь|ую|ю|ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$/;
const NOUN =
  /(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/;
const DERIVATIONAL = /(ост|ость)$/;
const SUPERLATIVE = /(ейш|ейше)$/;

function findRV(word: string): number {
  for (let i = 0; i < word.length; i++) {
    if (VOWEL.test(word[i])) return i + 1;
  }
  return word.length;
}

export function stem(input: string): string {
  let word = input.toLowerCase().replace(/ё/g, "е");
  if (word.length < 4) return word;

  const rv = findRV(word);
  const head = word.slice(0, rv);
  let tail = word.slice(rv);

  // Step 1: perfective gerund -> if not, reflexive + adjective/participle/verb/noun
  const perf = tail.match(PERFECTIVE);
  if (perf) {
    tail = tail.slice(0, tail.length - perf[0].length);
  } else {
    const ref = tail.match(REFLEXIVE);
    if (ref) tail = tail.slice(0, tail.length - ref[0].length);

    const adj = tail.match(ADJECTIVE);
    if (adj) {
      tail = tail.slice(0, tail.length - adj[0].length);
      const part = tail.match(PARTICIPLE);
      if (part) tail = tail.slice(0, tail.length - part[0].length);
    } else {
      const verb = tail.match(VERB);
      if (verb) {
        tail = tail.slice(0, tail.length - verb[0].length);
      } else {
        const noun = tail.match(NOUN);
        if (noun) tail = tail.slice(0, tail.length - noun[0].length);
      }
    }
  }

  // Step 2: -и
  if (tail.endsWith("и")) tail = tail.slice(0, -1);

  // Step 3: derivational
  const deriv = tail.match(DERIVATIONAL);
  if (deriv) tail = tail.slice(0, tail.length - deriv[0].length);

  // Step 4: superlative + -нн -> -н
  const sup = tail.match(SUPERLATIVE);
  if (sup) tail = tail.slice(0, tail.length - sup[0].length);
  if (tail.endsWith("нн")) tail = tail.slice(0, -1);
  if (tail.endsWith("ь")) tail = tail.slice(0, -1);

  return head + tail;
}

const STOPWORDS = new Set([
  "и", "в", "во", "не", "что", "он", "она", "оно", "они", "на", "я", "с", "со", "как",
  "а", "то", "все", "так", "его", "но", "да", "ты", "к", "у", "ж", "вы", "за", "бы",
  "по", "только", "ее", "мне", "было", "вот", "от", "меня", "ещё", "еще", "нет",
  "о", "из", "ему", "теперь", "когда", "даже", "ну", "вдруг", "ли", "если", "уже",
  "или", "ни", "быть", "был", "него", "до", "вас", "нибудь", "опять", "уж", "вам",
  "ведь", "там", "потом", "себя", "ничего", "ей", "может", "они", "тут", "где",
  "есть", "надо", "ней", "для", "мы", "тебя", "их", "чем", "была", "сам", "чтоб",
  "без", "будто", "чего", "раз", "тоже", "себе", "под", "будет", "ж", "тогда", "кто",
  "этот", "того", "потому", "этого", "какой", "совсем", "ним", "здесь", "этом", "один",
  "почти", "мой", "тем", "чтобы", "нее", "сейчас", "были", "куда", "зачем", "всех",
  "никогда", "можно", "при", "наконец", "два", "об", "другой", "хоть", "после",
  "над", "больше", "тот", "через", "эти", "нас", "про", "всего", "них", "какая",
  "много", "разве", "три", "эту", "моя", "впрочем", "хорошо", "свою", "этой", "перед",
  "иногда", "лучше", "чуть", "том", "нельзя", "такой", "им", "более", "всегда",
  "конечно", "всю", "между",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

export function stemTokens(tokens: string[]): string[] {
  return tokens.map(stem).filter((t) => t.length >= 2);
}
