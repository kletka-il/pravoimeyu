"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LawRef = { label: string; ref: string };

type Initial = {
  id: string;
  slug: string;
  title: string;
  shortAnswer: string;
  body: string;
  keywords: string[];
  lawRefs: LawRef[];
  urgency: number;
  categoryId: string;
  isPublished: boolean;
};

export default function ArticleForm({
  categories,
  initial,
}: {
  categories: { id: string; title: string }[];
  initial: Initial | null;
}) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string>(
    (initial?.keywords ?? []).join(", "),
  );
  const [lawRefs, setLawRefs] = useState<LawRef[]>(initial?.lawRefs ?? []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addRef() {
    setLawRefs((c) => [...c, { label: "", ref: "" }]);
  }
  function setRef(i: number, key: keyof LawRef, value: string) {
    setLawRefs((c) => c.map((r, j) => (i === j ? { ...r, [key]: value } : r)));
  }
  function rmRef(i: number) {
    setLawRefs((c) => c.filter((_, j) => j !== i));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      slug: String(fd.get("slug") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      shortAnswer: String(fd.get("shortAnswer") ?? "").trim(),
      body: String(fd.get("body") ?? ""),
      categoryId: String(fd.get("categoryId") ?? ""),
      urgency: Number(fd.get("urgency") ?? 1),
      isPublished: fd.get("isPublished") === "on",
      keywords: keywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      lawRefs: lawRefs.filter((r) => r.label && r.ref),
    };
    const url = initial
      ? `/api/admin/articles/${initial.id}`
      : "/api/admin/articles";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Ошибка сохранения");
      return;
    }
    router.push("/dashboard/admin/articles");
    router.refresh();
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Заголовок</label>
          <input className="input" name="title" required defaultValue={initial?.title} />
        </div>
        <div>
          <label className="label">Slug (латиницей, через дефисы)</label>
          <input className="input" name="slug" required defaultValue={initial?.slug} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="label">Категория</label>
          <select
            className="input"
            name="categoryId"
            required
            defaultValue={initial?.categoryId ?? ""}
          >
            <option value="" disabled>
              — выбрать —
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Срочность (1–5)</label>
          <input
            className="input"
            type="number"
            min={1}
            max={5}
            name="urgency"
            defaultValue={initial?.urgency ?? 2}
          />
        </div>
      </div>
      <div>
        <label className="label">Краткий ответ (что делать в 1–2 предложениях)</label>
        <textarea
          className="input min-h-[80px]"
          name="shortAnswer"
          required
          defaultValue={initial?.shortAnswer}
        />
      </div>
      <div>
        <label className="label">Текст статьи (поддерживается Markdown)</label>
        <textarea
          className="input min-h-[280px] font-mono text-sm"
          name="body"
          required
          defaultValue={initial?.body}
        />
        <p className="text-xs text-ink-400 mt-1">
          Поддерживается: ## заголовки, **жирный**, маркированные/нумерованные списки.
        </p>
      </div>
      <div>
        <label className="label">
          Ключевые слова (через запятую — для поиска)
        </label>
        <input
          className="input"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="например: дтп, авария, страховая"
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label className="label">Ссылки на закон</label>
          <button type="button" onClick={addRef} className="text-xs text-accent">
            + добавить
          </button>
        </div>
        <div className="space-y-2">
          {lawRefs.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ст. 81 ТК РФ"
                value={r.label}
                onChange={(e) => setRef(i, "label", e.target.value)}
              />
              <input
                className="input flex-[2]"
                placeholder="https://..."
                value={r.ref}
                onChange={(e) => setRef(i, "ref", e.target.value)}
              />
              <button
                type="button"
                onClick={() => rmRef(i)}
                className="text-ink-500 hover:text-accent text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={initial?.isPublished ?? true}
        />
        Опубликовано
      </label>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary" disabled={loading}>
        {loading ? "Сохраняем…" : initial ? "Сохранить" : "Создать"}
      </button>
    </form>
  );
}
