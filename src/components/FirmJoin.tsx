"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Firm = { id: string; name: string; address: string; description: string };
type Props = {
  currentFirmId?: string | null;
  currentFirmName?: string | null;
  firmJoinStatus: string;
};

export default function FirmJoin({ currentFirmId, currentFirmName, firmJoinStatus }: Props) {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!currentFirmId) {
      fetch("/api/firms").then(r => r.json()).then(d => setFirms(d.firms ?? []));
    }
  }, [currentFirmId]);

  async function handleJoin() {
    if (!selected) return;
    setStatus("loading"); setError(null);
    try {
      const res = await fetch("/api/specialist/firm-join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firmId: selected }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setError(d.error ?? "Ошибка"); setStatus("err"); return; }
      setStatus("ok");
      router.refresh();
    } catch { setError("Ошибка соединения"); setStatus("err"); }
  }

  async function handleLeave() {
    setStatus("loading"); setError(null);
    try {
      const res = await fetch("/api/specialist/firm-join", { method: "DELETE" });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Ошибка"); setStatus("err"); return; }
      setStatus("ok");
      router.refresh();
    } catch { setError("Ошибка соединения"); setStatus("err"); }
  }

  // Если уже в фирме или заявка подана
  if (currentFirmId) {
    const isPending = firmJoinStatus === "PENDING";
    const isMember = firmJoinStatus === "MEMBER";
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          isMember
            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
            : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
        }`}>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${isMember ? "text-green-700" : "text-amber-700"}`}>
              {isMember ? "Участник конторы" : "Заявка на рассмотрении"}
            </div>
            <div className="font-semibold text-ink-900 dark:text-white truncate">{currentFirmName}</div>
            {isPending && (
              <p className="text-xs text-ink-500 mt-0.5">Владелец конторы ещё не принял вашу заявку.</p>
            )}
          </div>
          <button
            onClick={handleLeave}
            disabled={status === "loading"}
            className="shrink-0 text-xs text-ink-400 hover:text-accent underline underline-offset-2 transition-colors disabled:opacity-40"
          >
            {isMember ? "Покинуть" : "Отозвать"}
          </button>
        </div>
        {error && <p className="text-xs text-accent">{error}</p>}
      </div>
    );
  }

  // Нет фирмы — форма выбора
  return (
    <div className="space-y-3">
      {firms.length === 0 ? (
        <p className="text-sm text-ink-400">Нет одобренных юридических контор на сайте.</p>
      ) : (
        <>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="input text-sm"
          >
            <option value="">— Выберите контору —</option>
            {firms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button
            onClick={handleJoin}
            disabled={!selected || status === "loading"}
            className="btn-primary text-sm py-2 px-5 disabled:opacity-40"
          >
            {status === "loading" ? "Отправляю…" : "Подать заявку"}
          </button>
        </>
      )}
      {status === "ok" && <p className="text-xs text-green-600">Заявка отправлена. Ждите подтверждения.</p>}
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}
