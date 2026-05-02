"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkRead({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    setLoading(false);
    router.refresh();
  }
  return (
    <button
      disabled={loading}
      onClick={toggle}
      className="text-xs text-ink-600 underline hover:text-accent"
    >
      {isRead ? "Пометить непрочитанным" : "Пометить прочитанным"}
    </button>
  );
}
