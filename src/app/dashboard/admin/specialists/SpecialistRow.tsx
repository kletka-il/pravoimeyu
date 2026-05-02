"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SPECIALIST_STATUS,
  SPECIALIST_STATUS_LABEL,
  type SpecialistStatus,
} from "@/lib/constants";

type Props = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  city: string;
  yearsExperience: number;
  pricePerHour: number;
  bio: string;
  specializations: string;
  credentials: string;
  status: SpecialistStatus;
};

const NEXT: Record<SpecialistStatus, SpecialistStatus[]> = {
  PENDING: [SPECIALIST_STATUS.APPROVED, SPECIALIST_STATUS.REJECTED],
  APPROVED: [SPECIALIST_STATUS.SUSPENDED, SPECIALIST_STATUS.REJECTED],
  REJECTED: [SPECIALIST_STATUS.PENDING, SPECIALIST_STATUS.APPROVED],
  SUSPENDED: [SPECIALIST_STATUS.APPROVED, SPECIALIST_STATUS.REJECTED],
};

export default function SpecialistRow(p: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(s: SpecialistStatus) {
    setLoading(true);
    await fetch(`/api/admin/specialists/${p.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <article className="card">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="font-semibold text-lg">{p.name}</div>
          <div className="text-xs text-ink-500">
            {p.email} · {p.verified ? "почта подтверждена" : "почта НЕ подтверждена"}
          </div>
          <div className="text-xs text-ink-500 mt-1">
            {p.city || "—"} · стаж {p.yearsExperience} лет · {p.pricePerHour
              ? p.pricePerHour.toLocaleString("ru-RU") + " ₽/час"
              : "цена не указана"}
          </div>
        </div>
        <span className="badge bg-ink-100 text-ink-700">
          {SPECIALIST_STATUS_LABEL[p.status]}
        </span>
      </div>
      {p.bio && <p className="text-sm text-ink-700 mt-3">{p.bio}</p>}
      <p className="text-xs text-ink-500 mt-2">
        <b>Специализации:</b> {p.specializations}
      </p>
      <p className="text-xs text-ink-500 mt-1">
        <b>Регалии:</b> {p.credentials}
      </p>
      <div className="mt-3 flex gap-2 flex-wrap">
        {NEXT[p.status].map((s) => (
          <button
            key={s}
            disabled={loading}
            onClick={() => setStatus(s)}
            className={
              s === SPECIALIST_STATUS.APPROVED
                ? "btn-primary text-sm py-2 px-4"
                : s === SPECIALIST_STATUS.REJECTED ||
                    s === SPECIALIST_STATUS.SUSPENDED
                  ? "btn-ghost text-sm"
                  : "btn-outline text-sm"
            }
          >
            → {SPECIALIST_STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </article>
  );
}
