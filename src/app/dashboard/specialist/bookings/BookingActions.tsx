"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BOOKING_STATUS, type BookingStatus } from "@/lib/constants";

const NEXT: Partial<Record<BookingStatus, BookingStatus[]>> = {
  NEW: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.CANCELLED],
  ACCEPTED: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
  IN_PROGRESS: [BOOKING_STATUS.CLOSED],
};

const LABEL: Record<BookingStatus, string> = {
  NEW: "Новая",
  ACCEPTED: "Принять",
  IN_PROGRESS: "В работу",
  CLOSED: "Закрыть",
  CANCELLED: "Отменить",
};

export default function BookingActions({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const next = NEXT[status] ?? [];
  if (next.length === 0) return null;

  async function setStatus(s: BookingStatus) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: s }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Не удалось обновить статус. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        {next.map((s) => (
          <button
            key={s}
            disabled={loading}
            onClick={() => setStatus(s)}
            className={
              s === BOOKING_STATUS.CANCELLED
                ? "btn-ghost text-sm disabled:opacity-50"
                : "btn-primary text-sm py-2 px-4 disabled:opacity-50"
            }
          >
            {LABEL[s]}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
