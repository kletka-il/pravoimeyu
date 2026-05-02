import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BOOKING_STATUS_LABEL, ROLE, type BookingStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ClientBookings() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.CLIENT) redirect("/dashboard");

  const bookings = await prisma.booking.findMany({
    where: { clientId: s.userId },
    include: {
      specialist: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="heading-serif text-2xl">Мои обращения</h2>
      {bookings.length === 0 ? (
        <div className="card text-ink-500">
          Пока обращений нет. Сделайте поиск по своей ситуации — на странице
          результатов будет кнопка для связи с юристом.
        </div>
      ) : (
        bookings.map((b) => (
          <article key={b.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{b.specialist.user.name}</div>
                <div className="text-xs text-ink-500">
                  {b.specialist.city} · стаж {b.specialist.yearsExperience} лет ·
                  ★ {b.specialist.rating.toFixed(1)}
                </div>
              </div>
              <span className="badge bg-ink-100 text-ink-700">
                {BOOKING_STATUS_LABEL[b.status as BookingStatus]}
              </span>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed whitespace-pre-line">
              {b.question}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-ink-400">
                Создано {b.createdAt.toLocaleString("ru-RU")}
              </div>
              <Link
                href={`/dashboard/client/bookings/${b.id}`}
                className="text-sm text-accent hover:underline"
              >
                Открыть (чат + документы) →
              </Link>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
