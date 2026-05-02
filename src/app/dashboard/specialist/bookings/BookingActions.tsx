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
  const router = useRouter();
  const next = NEXT[status] ?? [];
  if (next.length === 0) return null;

  async function setStatus(s: BookingStatus) {
    setLoading(true);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      {next.map((s) => (
        <button
          key={s}
          disabled={loading}
          onClick={() => setStatus(s)}
          className={
            s === BOOKING_STATUS.CANCELLED
              ? "btn-ghost text-sm"
              : "btn-primary text-sm py-2 px-4"
          }
        >
          {LABEL[s]}
        </button>
      ))}
    </div>
  );
}
