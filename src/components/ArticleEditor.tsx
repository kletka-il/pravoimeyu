"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

type LawRef = { label: string; ref: string };

export type ArticleData = {
  title: string;
  shortAnswer: string;
  body: string;
  categoryId: string;
  urgency: number;
  keywords: string[];
  lawRefs: LawRef[];
};

type Props = {
  articleId?: string;
  initial?: Partial<ArticleData>;
  categories: { id: string; title: string; icon: string }[];
  savedAt?: Date;
  status?: string;
  rejectionReason?: string;
};

const URGENCY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Информационная", color: "text-ink-500" },
  2: { label: "Обычная", color: "text-brand-600" },
  3: { label: "Важная", color: "text-sun-600" },
  4: { label: "Срочная", color: "text-orange-600" },
  5: { label: "Критическая", color: "text-accent" },
};

function empty(): ArticleData {
  return {
    title: "",
    shortAnswer: "",
    body: "",
    categoryId: "",
    urgency: 2,
    keywords: [],
    lawRefs: [],
  };
}

function merge(base: ArticleData, patch: Partial<ArticleData>): ArticleData {
  return {
    title: patch.title ?? base.title,
    shortAnswer: patch.shortAnswer ?? base.shortAnswer,
    body: patch.body ?? base.body,
    categoryId: patch.categoryId ?? base.categoryId,
    urgency: patch.urgency ?? base.urgency,
    keywords: patch.keywords ?? base.keywords,
    lawRefs: patch.lawRefs ?? base.lawRefs,
  };
}

function getCompletionItems(data: ArticleData) {
  return [
    {
      key: "title",
      label: "Заголовок",
      done: data.title.trim().length >= 3,
    },
    {
      key: "shortAnswer",
      label: `Краткий ответ (мин. 50 симв., сейчас ${data.shortAnswer.trim().length})`,
      done: data.shortAnswer.trim().length >= 50,
    },
    {
      key: "body",
      label: `Текст статьи (мин. 200 симв., сейчас ${data.body.trim().length})`,
      done: data.body.trim().length >= 200,
    },
    {
      key: "categoryId",
      label: "Категория",
      done: !!data.categoryId,
    },
    {
      key: "urgency",
      label: "Уровень срочности",
      done: data.urgency >= 1 && data.urgency <= 5,
    },
  ];
}

function formatSavedAt(date: Date | null): string {
  if (!date) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 10) return "только что";
  if (diff < 60) return `${diff} сек. назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
  return date.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdownPreview(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n{2,}/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hlp])(.+)$/gm, '$1')
    .replace(/^(.)/m, '<p class="mb-3">$1')
    + '</p>';
}

export default function ArticleEditor({
  articleId,
  initial,
  categories,
  savedAt,
  status,
  rejectionReason,
}: Props) {
  const router = useRouter();
  const lsKey = `article_draft_${articleId ?? "new"}`;

  const [data, setData] = useState<ArticleData>(() => merge(empty(), initial ?? {}));
  const [keywordsInput, setKeywordsInput] = useState(
    (initial?.keywords ?? []).join(", "),
  );
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(savedAt ?? null);
  const [saveTick, setSaveTick] = useState(0); // forces re-render for relative time
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | undefined>(articleId);
  const [lsRestored, setLsRestored] = useState(false);

  const dataRef = useRef(data);
  dataRef.current = data;
  const currentIdRef = useRef(currentId);
  currentIdRef.current = currentId;

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) return;
      const stored: { data: ArticleData; ts: number; keywordsInput?: string } =
        JSON.parse(raw);
      const serverTs = savedAt ? savedAt.getTime() : 0;
      if (stored.ts > serverTs) {
        setData(stored.data);
        setKeywordsInput(stored.keywordsInput ?? stored.data.keywords.join(", "));
        setLsRestored(true);
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to localStorage every 30s
  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(
          lsKey,
          JSON.stringify({ data: dataRef.current, ts: Date.now(), keywordsInput }),
        );
      } catch {
        // quota exceeded — ignore
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [lsKey, keywordsInput]);

  // Auto-save to server every 60s for existing drafts
  useEffect(() => {
    if (!currentIdRef.current) return;
    const id = setInterval(async () => {
      if (!currentIdRef.current) return;
      if (status === "PENDING" || status === "APPROVED") return;
      try {
        await fetch(`/api/specialist/articles/${currentIdRef.current}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(buildPayload(dataRef.current)),
        });
        setLocalSavedAt(new Date());
        setSaveError(null);
      } catch {
        // silent auto-save failure
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [currentIdRef.current, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update "X мин назад" display every 30s
  useEffect(() => {
    const id = setInterval(() => setSaveTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  function buildPayload(d: ArticleData) {
    return {
      title: d.title,
      shortAnswer: d.shortAnswer,
      body: d.body,
      categoryId: d.categoryId,
      urgency: d.urgency,
      keywords: keywordsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      lawRefs: d.lawRefs.filter((r) => r.label || r.ref),
    };
  }

  const set = useCallback(
    <K extends keyof ArticleData>(key: K, value: ArticleData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  function setRef(i: number, key: keyof LawRef, value: string) {
    setData((prev) => ({
      ...prev,
      lawRefs: prev.lawRefs.map((r, j) => (i === j ? { ...r, [key]: value } : r)),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const payload = buildPayload(data);
    try {
      if (currentId) {
        const res = await fetch(`/api/specialist/articles/${currentId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error ?? "Ошибка сохранения");
        }
      } else {
        const res = await fetch("/api/specialist/articles", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error ?? "Ошибка создания");
        }
        const resp = await res.json();
        const newId = resp.article?.id;
        if (newId) {
          setCurrentId(newId);
          // Move LS entry to the new key
          try {
            const raw = localStorage.getItem(lsKey);
            if (raw) {
              localStorage.setItem(`article_draft_${newId}`, raw);
              localStorage.removeItem(lsKey);
            }
          } catch { /* ignore */ }
          router.replace(`/dashboard/specialist/articles/${newId}`);
        }
      }
      setLocalSavedAt(new Date());
      // Save to LS too
      try {
        localStorage.setItem(
          `article_draft_${currentId ?? "new"}`,
          JSON.stringify({ data, ts: Date.now(), keywordsInput }),
        );
      } catch { /* ignore */ }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!currentId) {
      // Save first
      await handleSave();
      if (!currentIdRef.current) return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(
        `/api/specialist/articles/${currentIdRef.current}/submit`,
        { method: "POST" },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(
          d?.errors ? d.errors.join("; ") : d?.error ?? "Ошибка отправки",
        );
      }
      // Clear localStorage
      try {
        localStorage.removeItem(`article_draft_${currentIdRef.current}`);
      } catch { /* ignore */ }
      setConfirmSubmit(false);
      router.push("/dashboard/specialist/articles");
      router.refresh();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSubmitting(false);
    }
  }

  const completionItems = getCompletionItems(data);
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);
  const canSubmit =
    completedCount === completionItems.length &&
    (status === "DRAFT" || status === "REJECTED" || !status);

  const isReadonly = status === "PENDING" || status === "APPROVED";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Rejection banner */}
      {status === "REJECTED" && rejectionReason && (
        <div className="bg-red-50 dark:bg-red-950 border-b-2 border-accent px-4 py-3">
          <div className="container-page flex items-start gap-3">
            <span className="text-accent text-xl mt-0.5">✕</span>
            <div>
              <p className="font-semibold text-accent">Статья отклонена модератором</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                {rejectionReason}
              </p>
              <p className="text-xs text-ink-500 mt-1">
                Исправьте замечания и отправьте повторно.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending banner */}
      {status === "PENDING" && (
        <div className="bg-amber-50 dark:bg-amber-950 border-b-2 border-amber-400 px-4 py-3">
          <div className="container-page flex items-center gap-3">
            <span className="text-amber-600 text-xl">⏳</span>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Статья отправлена на проверку. Редактирование недоступно до решения модератора.
            </p>
          </div>
        </div>
      )}

      {/* Approved banner */}
      {status === "APPROVED" && (
        <div className="bg-green-50 dark:bg-green-950 border-b-2 border-green-500 px-4 py-3">
          <div className="container-page flex items-center gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Статья одобрена и опубликована в базе знаний.
            </p>
          </div>
        </div>
      )}

      {/* LS restore notice */}
      {lsRestored && (
        <div className="bg-brand-50 dark:bg-brand-950 border-b border-brand-200 px-4 py-2">
          <div className="container-page flex items-center justify-between gap-3">
            <p className="text-sm text-brand-700 dark:text-brand-300">
              Восстановлен черновик из локального хранилища.
            </p>
            <button
              className="text-xs text-ink-500 underline"
              onClick={() => setLsRestored(false)}
            >
              Скрыть
            </button>
          </div>
        </div>
      )}

      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800 shadow-sm">
        <div className="container-page py-3 flex items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <input
              className="w-full text-xl font-bold bg-transparent border-0 outline-none focus:ring-0 text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-ink-600 truncate"
              placeholder="Заголовок статьи…"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              disabled={isReadonly}
              maxLength={200}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {localSavedAt && (
              <span
                key={saveTick}
                className="text-xs text-ink-400 hidden sm:block whitespace-nowrap"
              >
                Сохранено · {formatSavedAt(localSavedAt)}
              </span>
            )}
            {saveError && (
              <span className="text-xs text-accent hidden sm:block">{saveError}</span>
            )}

            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="btn-outline text-sm py-1.5 px-3"
            >
              {preview ? "Редактировать" : "Предпросмотр"}
            </button>

            {!isReadonly && (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-outline text-sm py-1.5 px-3 disabled:opacity-50"
                >
                  {saving ? "Сохраняем…" : "Сохранить"}
                </button>

                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() => setConfirmSubmit(true)}
                  title={
                    !canSubmit ? "Заполните все обязательные поля" : undefined
                  }
                  className="btn-primary text-sm py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить на проверку
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-page py-6 flex-1">
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Editor / Preview */}
          <div className="space-y-5">
            {preview ? (
              <div className="card">
                <h2 className="heading-sans text-2xl mb-1">{data.title || "Заголовок"}</h2>
                {data.shortAnswer && (
                  <div className="bg-brand-50 dark:bg-brand-950 border-l-4 border-brand-500 px-4 py-3 rounded-r-xl mb-4 text-brand-800 dark:text-brand-200 font-medium">
                    {data.shortAnswer}
                  </div>
                )}
                <div
                  className="prose-legal text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownPreview(data.body || "Текст статьи пока не добавлен."),
                  }}
                />
                {data.lawRefs.filter((r) => r.label || r.ref).length > 0 && (
                  <div className="mt-6 pt-4 border-t border-ink-100 dark:border-ink-800">
                    <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">
                      Ссылки на законы:
                    </h3>
                    <ul className="space-y-1">
                      {data.lawRefs
                        .filter((r) => r.label || r.ref)
                        .map((r, i) => (
                          <li key={i} className="text-sm">
                            {r.ref ? (
                              <a
                                href={r.ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-700 dark:text-brand-400 underline"
                              >
                                {r.label || r.ref}
                              </a>
                            ) : (
                              <span>{r.label}</span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {data.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="badge bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Category & Urgency row */}
                <div className="card space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        Категория <span className="text-accent">*</span>
                      </label>
                      <select
                        className="input"
                        value={data.categoryId}
                        onChange={(e) => set("categoryId", e.target.value)}
                        disabled={isReadonly}
                      >
                        <option value="">— выбрать —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.title}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-ink-400 mt-1">
                        Выберите наиболее подходящую правовую область.
                      </p>
                    </div>

                    <div>
                      <label className="label">
                        Срочность ситуации <span className="text-accent">*</span>
                      </label>
                      <div className="space-y-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <label
                            key={v}
                            className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-lg border transition-colors ${
                              data.urgency === v
                                ? "border-brand-400 bg-brand-50 dark:bg-brand-950"
                                : "border-transparent hover:bg-ink-50 dark:hover:bg-ink-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name="urgency"
                              value={v}
                              checked={data.urgency === v}
                              onChange={() => set("urgency", v)}
                              disabled={isReadonly}
                              className="accent-brand-600"
                            />
                            <span className={URGENCY_LABELS[v].color}>
                              {v}. {URGENCY_LABELS[v].label}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-ink-400 mt-1">
                        Насколько срочно гражданину нужна эта информация.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Short answer */}
                <div className="card">
                  <label className="label">
                    Краткий ответ <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      className={`input min-h-[100px] pr-16 ${
                        data.shortAnswer.length > 400 ? "border-accent" : ""
                      }`}
                      placeholder="Одно-два предложения: что делать в первую очередь. Например: «Немедленно обратитесь в трудовую инспекцию с заявлением — у вас есть 3 месяца.»"
                      value={data.shortAnswer}
                      onChange={(e) => set("shortAnswer", e.target.value)}
                      maxLength={400}
                      disabled={isReadonly}
                    />
                    <span
                      className={`absolute bottom-3 right-3 text-xs ${
                        data.shortAnswer.length > 380
                          ? "text-accent"
                          : "text-ink-400"
                      }`}
                    >
                      {data.shortAnswer.length}/400
                    </span>
                  </div>
                  <p className="text-xs text-ink-400 mt-1">
                    Это первое, что увидит человек. Минимум 50 символов. Пишите конкретно и по делу.
                  </p>
                </div>

                {/* Body */}
                <div className="card">
                  <label className="label">
                    Полный текст <span className="text-accent">*</span>
                  </label>
                  <textarea
                    className="input font-mono text-sm"
                    style={{ minHeight: 400 }}
                    placeholder={`Напишите подробную статью. Используйте Markdown-разметку:

## Заголовок раздела

Ваш текст здесь. Объясните ситуацию подробно.

**Важный термин** — определение.

- Первый шаг
- Второй шаг
- Третий шаг

Минимум 200 символов. Ссылайтесь на конкретные статьи законов.`}
                    value={data.body}
                    onChange={(e) => set("body", e.target.value)}
                    disabled={isReadonly}
                  />
                  <p className="text-xs text-ink-400 mt-1">
                    Поддерживается Markdown: ## заголовки, **жирный**, - списки. Минимум 200 символов.
                    Текущий объём: {data.body.trim().length} симв.
                  </p>
                </div>

                {/* Law refs */}
                <div className="card">
                  <div className="flex items-baseline justify-between mb-3">
                    <label className="label mb-0">Ссылки на законы</label>
                    {!isReadonly && (
                      <button
                        type="button"
                        onClick={() =>
                          set("lawRefs", [...data.lawRefs, { label: "", ref: "" }])
                        }
                        className="text-sm text-brand-700 dark:text-brand-400 hover:underline font-medium"
                      >
                        + Добавить ссылку
                      </button>
                    )}
                  </div>
                  {data.lawRefs.length === 0 && (
                    <p className="text-sm text-ink-400 italic">
                      Добавьте ссылки на статьи законов, которые обосновывают ваши рекомендации.
                    </p>
                  )}
                  <div className="space-y-2">
                    {data.lawRefs.map((r, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          className="input flex-1 text-sm py-2"
                          placeholder="Ст. 81 ТК РФ"
                          value={r.label}
                          onChange={(e) => setRef(i, "label", e.target.value)}
                          disabled={isReadonly}
                        />
                        <input
                          className="input flex-[2] text-sm py-2"
                          placeholder="https://consultant.ru/..."
                          value={r.ref}
                          onChange={(e) => setRef(i, "ref", e.target.value)}
                          disabled={isReadonly}
                        />
                        {!isReadonly && (
                          <button
                            type="button"
                            onClick={() =>
                              set(
                                "lawRefs",
                                data.lawRefs.filter((_, j) => j !== i),
                              )
                            }
                            className="text-ink-400 hover:text-accent text-lg leading-none shrink-0"
                            aria-label="Удалить ссылку"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-400 mt-2">
                    Укажите название (напр. «Ст. 142 ТК РФ») и ссылку. Это повышает авторитетность статьи.
                  </p>
                </div>

                {/* Keywords */}
                <div className="card">
                  <label className="label">Ключевые слова</label>
                  <KeywordsInput
                    value={keywordsInput}
                    onChange={setKeywordsInput}
                    disabled={isReadonly}
                  />
                  <p className="text-xs text-ink-400 mt-1">
                    Через запятую или Enter. Помогают найти статью в поиске. Например: «увольнение, трудовой кодекс, выплаты».
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Completion checklist */}
            <div className="card">
              <h3 className="font-semibold text-sm text-ink-700 dark:text-ink-300 mb-3">
                Готовность статьи
              </h3>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-ink-500 mb-1">
                  <span>{completedCount} из {completionItems.length}</span>
                  <span>{completionPct}%</span>
                </div>
                <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      completionPct === 100
                        ? "bg-green-500"
                        : completionPct >= 60
                          ? "bg-brand-500"
                          : "bg-sun-400"
                    }`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
              <ul className="space-y-1.5">
                {completionItems.map((item) => (
                  <li
                    key={item.key}
                    className={`flex items-start gap-2 text-xs ${
                      item.done
                        ? "text-green-700 dark:text-green-400"
                        : "text-ink-500"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {item.done ? "✓" : "○"}
                    </span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="card bg-brand-50 dark:bg-brand-950 border-brand-100 dark:border-brand-900">
              <h3 className="font-semibold text-sm text-brand-800 dark:text-brand-200 mb-2">
                Советы редактора
              </h3>
              <ul className="text-xs text-brand-700 dark:text-brand-300 space-y-1.5 list-disc pl-4">
                <li>Пишите для человека без юридического образования.</li>
                <li>Структурируйте: проблема → причина → решение.</li>
                <li>Конкретные сроки и нормы лучше общих фраз.</li>
                <li>Проверьте актуальность законодательства.</li>
                <li>После одобрения статья выйдет с вашим именем.</li>
              </ul>
            </div>

            {/* Status info */}
            {status && (
              <div className="card text-center">
                <p className="text-xs text-ink-500 mb-1">Статус</p>
                <StatusBadge status={status} large />
              </div>
            )}

            {/* Mobile save/submit buttons */}
            {!isReadonly && (
              <div className="flex flex-col gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-outline w-full text-sm disabled:opacity-50"
                >
                  {saving ? "Сохраняем…" : "Сохранить черновик"}
                </button>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => setConfirmSubmit(true)}
                  className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить на проверку
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Confirm submit modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !submitting && setConfirmSubmit(false)}
          />
          <div className="relative bg-white dark:bg-ink-900 rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h2 className="heading-serif text-xl">Отправить на проверку?</h2>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              Статья будет отправлена на проверку модератором. После одобрения
              она появится в базе знаний с вашим именем.
            </p>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              До решения модератора редактирование будет недоступно.
            </p>
            {submitError && (
              <div className="bg-red-50 dark:bg-red-950 border border-accent rounded-xl p-3 text-sm text-accent">
                {submitError}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                className="btn-outline flex-1 text-sm"
                disabled={submitting}
                onClick={() => {
                  setConfirmSubmit(false);
                  setSubmitError(null);
                }}
              >
                Отмена
              </button>
              <button
                className="btn-primary flex-1 text-sm disabled:opacity-50"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Отправляем…" : "Отправить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tag-style keywords input
function KeywordsInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const tags = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [inputVal, setInputVal] = useState("");

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setInputVal("");
      return;
    }
    onChange([...tags, t].join(", "));
    setInputVal("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag).join(", "));
  }

  return (
    <div
      className={`input cursor-text flex flex-wrap gap-1.5 min-h-[44px] ${
        disabled ? "opacity-60" : ""
      }`}
      onClick={() => {
        if (!disabled) {
          const el = document.getElementById("kw-input");
          el?.focus();
        }
      }}
    >
      {tags.map((t) => (
        <span
          key={t}
          className="badge bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 flex items-center gap-1"
        >
          {t}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(t);
              }}
              className="hover:text-accent ml-0.5"
            >
              ×
            </button>
          )}
        </span>
      ))}
      {!disabled && (
        <input
          id="kw-input"
          className="flex-1 min-w-[80px] bg-transparent outline-none border-0 text-sm placeholder:text-ink-400"
          placeholder={tags.length === 0 ? "увольнение, трудовой кодекс…" : ""}
          value={inputVal}
          disabled={disabled}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputVal);
            }
            if (
              e.key === "Backspace" &&
              inputVal === "" &&
              tags.length > 0
            ) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          onBlur={() => addTag(inputVal)}
        />
      )}
    </div>
  );
}

export function StatusBadge({
  status,
  large,
}: {
  status: string;
  large?: boolean;
}) {
  const base = large ? "badge text-sm px-3 py-1" : "badge";
  switch (status) {
    case "DRAFT":
      return (
        <span className={`${base} bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400`}>
          Черновик
        </span>
      );
    case "PENDING":
      return (
        <span className={`${base} bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200`}>
          На проверке
        </span>
      );
    case "APPROVED":
      return (
        <span className={`${base} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`}>
          Одобрено
        </span>
      );
    case "REJECTED":
      return (
        <span className={`${base} bg-red-100 dark:bg-red-900 text-accent dark:text-red-300`}>
          Отклонено
        </span>
      );
    default:
      return (
        <span className={`${base} bg-ink-100 dark:bg-ink-800 text-ink-600`}>
          {status}
        </span>
      );
  }
}
