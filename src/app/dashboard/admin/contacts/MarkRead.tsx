"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkRead({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function toggle() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isRead: !isRead }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        disabled={loading}
        onClick={toggle}
        className="text-xs text-ink-600 underline hover:text-accent disabled:opacity-50"
      >
        {loading ? "…" : isRead ? "Пометить непрочитанным" : "Пометить прочитанным"}
      </button>
      {error && <span className="text-xs text-red-500">Ошибка</span>}
    </span>
  );
}
