"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FirmMemberActions({
  specialistId,
  action,
}: {
  specialistId: string;
  action: "pending" | "member";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle(act: "accept" | "reject") {
    setLoading(true);
    await fetch(`/api/firm/members/${specialistId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: act }),
    });
    setLoading(false);
    router.refresh();
  }

  if (action === "pending") {
    return (
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => handle("accept")}
          disabled={loading}
          className="btn-primary text-sm py-1.5 px-4 disabled:opacity-40"
        >
          Принять
        </button>
        <button
          onClick={() => handle("reject")}
          disabled={loading}
          className="btn-ghost text-sm py-1.5 px-4 text-accent disabled:opacity-40"
        >
          Отклонить
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => handle("reject")}
      disabled={loading}
      className="text-xs text-ink-400 hover:text-accent underline underline-offset-2 transition-colors disabled:opacity-40 shrink-0"
    >
      Исключить
    </button>
  );
}
