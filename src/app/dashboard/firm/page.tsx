import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import FirmMemberActions from "./FirmMemberActions";

export const dynamic = "force-dynamic";

export default async function FirmDashboard() {
  const s = await getSession();
  if (!s.userId) redirect("/login?next=/dashboard/firm");

  const firm = await prisma.lawFirm.findUnique({
    where: { ownerId: s.userId },
  });
  if (!firm) redirect("/dashboard");

  const members = await prisma.specialistProfile.findMany({
    where: { firmId: firm.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { firmJoinStatus: "asc" },
  });

  const pending = members.filter(m => m.firmJoinStatus === "PENDING");
  const approved = members.filter(m => m.firmJoinStatus === "MEMBER");

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Шапка */}
      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="heading-serif text-2xl">{firm.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge text-xs ${
                firm.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : firm.status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}>
                {firm.status === "APPROVED" ? "Одобрена" : firm.status === "PENDING" ? "На проверке" : "Отклонена"}
              </span>
              {firm.inn && <span className="text-xs text-ink-400">ИНН {firm.inn}</span>}
            </div>
          </div>
          <div className="text-sm text-ink-500 space-y-0.5">
            {firm.address && <div>📍 {firm.address}</div>}
            {firm.phone && <div>📞 {firm.phone}</div>}
            {firm.website && <div>🌐 {firm.website}</div>}
          </div>
        </div>
      </div>

      {/* Заявки на вступление */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="heading-serif text-xl">Заявки на вступление</h3>
            <span className="badge bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              {pending.length}
            </span>
          </div>
          <div className="card p-0 overflow-hidden divide-y divide-ink-100 dark:divide-ink-800">
            {pending.map(m => (
              <div key={m.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-ink-900 dark:text-white">{m.user.name}</div>
                  <div className="text-xs text-ink-400 mt-0.5">
                    {m.user.email}
                    {m.city && ` · ${m.city}`}
                    {m.yearsExperience > 0 && ` · стаж ${m.yearsExperience} лет`}
                  </div>
                </div>
                <FirmMemberActions specialistId={m.id} action="pending" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Текущие участники */}
      <div className="space-y-3">
        <h3 className="heading-serif text-xl">
          Участники конторы
          {approved.length > 0 && (
            <span className="ml-2 text-base text-ink-400 font-normal">({approved.length})</span>
          )}
        </h3>
        {approved.length === 0 ? (
          <div className="card text-center py-8 text-ink-400 text-sm">
            Пока нет подтверждённых участников.<br/>
            {pending.length === 0 ? "Юристы смогут подавать заявки из своего профиля." : "Одобрите заявки выше."}
          </div>
        ) : (
          <div className="card p-0 overflow-hidden divide-y divide-ink-100 dark:divide-ink-800">
            {approved.map(m => (
              <div key={m.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-ink-900 dark:text-white">{m.user.name}</div>
                  <div className="text-xs text-ink-400 mt-0.5">
                    {m.user.email}
                    {m.city && ` · ${m.city}`}
                    {m.yearsExperience > 0 && ` · стаж ${m.yearsExperience} лет`}
                  </div>
                </div>
                <FirmMemberActions specialistId={m.id} action="member" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
