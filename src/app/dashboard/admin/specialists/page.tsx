import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  ROLE,
  SPECIALIST_STATUS,
  SPECIALIST_STATUS_LABEL,
  type SpecialistStatus,
} from "@/lib/constants";
import { SPECIALIZATIONS } from "@/lib/data/categories";
import SpecialistRow from "./SpecialistRow";

export const dynamic = "force-dynamic";

export default async function AdminSpecialistsPage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");

  const profiles = await prisma.specialistProfile.findMany({
    include: { user: { select: { name: true, email: true, emailVerified: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const grouped: Record<SpecialistStatus, typeof profiles> = {
    PENDING: [],
    APPROVED: [],
    REJECTED: [],
    SUSPENDED: [],
  };
  for (const p of profiles) grouped[p.status as SpecialistStatus].push(p);

  return (
    <div className="space-y-8">
      {(Object.keys(grouped) as SpecialistStatus[]).map((status) => {
        const list = grouped[status];
        if (list.length === 0) return null;
        return (
          <section key={status}>
            <h2 className="heading-serif text-2xl mb-3">
              {SPECIALIST_STATUS_LABEL[status]}{" "}
              <span className="text-ink-400 text-sm font-normal">({list.length})</span>
            </h2>
            <div className="space-y-3">
              {list.map((p) => {
                const parseJson = (v: unknown): string[] => {
                  if (Array.isArray(v)) return v as string[];
                  if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
                  return [];
                };
                const specs =
                  parseJson(p.specializations)
                    .map((k) => SPECIALIZATIONS[k] ?? k)
                    .join(", ") || "—";
                const creds = parseJson(p.credentials).join(" · ") || "—";
                return (
                  <SpecialistRow
                    key={p.id}
                    id={p.id}
                    name={p.user.name}
                    email={p.user.email}
                    verified={!!p.user.emailVerified}
                    city={p.city}
                    yearsExperience={p.yearsExperience}
                    pricePerHour={p.pricePerHour}
                    bio={p.bio}
                    specializations={specs}
                    credentials={creds}
                    status={p.status as SpecialistStatus}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      {profiles.length === 0 && (
        <div className="card text-ink-500">Юристов пока нет.</div>
      )}
      <div className="text-xs text-ink-400">
        Возможные действия:{" "}
        {Object.entries(SPECIALIST_STATUS).map(([k, v]) => (
          <span key={k}>{SPECIALIST_STATUS_LABEL[v]} </span>
        ))}
      </div>
    </div>
  );
}
