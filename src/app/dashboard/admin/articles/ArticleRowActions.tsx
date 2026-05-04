"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ArticleRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Не удалось изменить статус");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm("Точно удалить статью?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Не удалось удалить статью");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2 justify-end">
        <Link
          href={`/dashboard/admin/articles/${id}`}
          className="text-xs text-accent underline"
        >
          Изменить
        </Link>
        <button
          disabled={loading}
          onClick={toggle}
          className="text-xs text-ink-600 underline disabled:opacity-50"
        >
          {isPublished ? "Скрыть" : "Опубликовать"}
        </button>
        <button
          disabled={loading}
          onClick={remove}
          className="text-xs text-ink-500 hover:text-accent disabled:opacity-50"
        >
          Удалить
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
