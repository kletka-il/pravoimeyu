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

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    setLoading(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Точно удалить статью?")) return;
    setLoading(true);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
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
        className="text-xs text-ink-600 underline"
      >
        {isPublished ? "Скрыть" : "Опубликовать"}
      </button>
      <button
        disabled={loading}
        onClick={remove}
        className="text-xs text-ink-500 hover:text-accent"
      >
        Удалить
      </button>
    </div>
  );
}
