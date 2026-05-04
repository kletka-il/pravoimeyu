import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BOOKING_STATUS_LABEL, ROLE, type BookingStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.CLIENT) redirect("/dashboard");

  const [recentSearches, bookings] = await Promise.all([
    prisma.searchLog.findMany({
      where: { userId: s.userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.booking.findMany({
      where: { clientId: s.userId },
      include: {
        specialist: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <h2 className="heading-serif text-2xl mb-2">Что мне делать?</h2>
          <p className="text-ink-600">
            Опишите ситуацию в строке поиска — мы найдём готовый ответ или
            подберём специалиста.
          </p>
          <Link href="/search" className="btn-primary mt-4">
            Открыть поиск
          </Link>
        </div>

        <div className="card">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="heading-serif text-xl">Последние обращения</h3>
            <Link href="/dashboard/client/bookings" className="text-sm text-accent">
              Все →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-ink-500 text-sm">
              Вы ещё не отправляли обращений юристам. Начните с поиска по своей
              ситуации — там же сможете связаться со специалистом.
            </p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {bookings.map((b) => (
                <li key={b.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{b.specialist.user.name}</div>
                    <div className="text-sm text-ink-600 mt-1 line-clamp-2">
                      {b.question}
                    </div>
                  </div>
                  <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 shrink-0">
                    {BOOKING_STATUS_LABEL[b.status as BookingStatus]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside>
        <div className="card">
          <h3 className="heading-serif text-xl mb-3">История поиска</h3>
          {recentSearches.length === 0 ? (
            <p className="text-ink-500 text-sm">Здесь будут ваши последние запросы.</p>
          ) : (
            <ul className="space-y-2">
              {recentSearches.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s.query)}`}
                    className="text-sm text-ink-700 hover:text-accent block truncate"
                  >
                    {s.query}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
