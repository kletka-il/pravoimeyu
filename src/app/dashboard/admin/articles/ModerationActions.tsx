"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModerationActions({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function call(action: "approve" | "reject") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${articleId}/moderate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error ?? "Ошибка");
      }
      setRejecting(false);
      setReason("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (rejecting) {
    return (
      <div className="space-y-2">
        <textarea
          className="input text-sm min-h-[72px] py-2"
          placeholder="Укажите причину отклонения…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        {error && <p className="text-xs text-accent">{error}</p>}
        <div className="flex gap-2">
          <button
            className="btn-outline text-xs py-1.5 px-3 flex-1"
            disabled={loading}
            onClick={() => { setRejecting(false); setError(null); }}
          >
            Отмена
          </button>
          <button
            disabled={loading || !reason.trim()}
            onClick={() => call("reject")}
            className="text-xs py-1.5 px-3 rounded-lg font-semibold bg-accent text-white hover:bg-red-700 disabled:opacity-50 flex-1 transition-colors"
          >
            {loading ? "…" : "Отклонить"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => call("approve")}
          className="text-xs py-1.5 px-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "…" : "Одобрить"}
        </button>
        <button
          disabled={loading}
          onClick={() => setRejecting(true)}
          className="text-xs py-1.5 px-3 rounded-lg font-semibold bg-red-100 dark:bg-red-950 text-accent hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          Отклонить
        </button>
      </div>
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
    </div>
  );
}
