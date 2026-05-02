import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE, BOOKING_STATUS_LABEL, type BookingStatus } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");

  const now = new Date();
  const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    usersCount,
    clientsCount,
    specPending,
    specApproved,
    articlesCount,
    bookingsTotal,
    bookingsWeek,
    contactsUnread,
    searchesWeek,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: ROLE.CLIENT } }),
    prisma.specialistProfile.count({ where: { status: "PENDING" } }),
    prisma.specialistProfile.count({ where: { status: "APPROVED" } }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: day7 } } }),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.searchLog.count({ where: { createdAt: { gte: day7 } } }),
  ]);

  const [bookingsByStatus, topArticles, topSearches, recentBookings] = await Promise.all([
    prisma.booking.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, slug: true, title: true, views: true },
    }),
    prisma.searchLog.groupBy({
      by: ["query"],
      where: { createdAt: { gte: day30 } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        client: { select: { name: true } },
        specialist: { include: { user: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Основные метрики */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Пользователей всего" value={usersCount} />
        <Stat label="Клиентов" value={clientsCount} />
        <Stat
          label="Юристов ждут модерации"
          value={specPending}
          accent={specPending > 0}
          href="/dashboard/admin/specialists"
        />
        <Stat label="Юристов одобрено" value={specApproved} />
        <Stat label="Статей опубликовано" value={articlesCount} href="/dashboard/admin/articles" />
        <Stat label="Обращений всего" value={bookingsTotal} />
        <Stat label="Обращений за 7 дней" value={bookingsWeek} />
        <Stat
          label="Непрочитанных контактов"
          value={contactsUnread}
          accent={contactsUnread > 0}
          href="/dashboard/admin/contacts"
        />
        <Stat label="Поисков за 7 дней" value={searchesWeek} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Статусы обращений */}
        <div className="card">
          <h3 className="heading-serif text-xl mb-3">Обращения по статусам</h3>
          {bookingsByStatus.length === 0 ? (
            <p className="text-sm text-ink-500">Пока нет.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {bookingsByStatus.map((b) => (
                <li key={b.status} className="py-2 flex items-center justify-between text-sm">
                  <span className="text-ink-700">
                    {BOOKING_STATUS_LABEL[b.status as BookingStatus] ?? b.status}
                  </span>
                  <span className="font-semibold">{b._count.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Последние обращения */}
        <div className="card">
          <h3 className="heading-serif text-xl mb-3">Последние обращения</h3>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-ink-500">Пока нет.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recentBookings.map((b) => (
                <li key={b.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{b.client.name}</span>
                    <span className="text-xs text-ink-400">
                      {new Date(b.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    → {b.specialist.user.name} · {BOOKING_STATUS_LABEL[b.status as BookingStatus]}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Топ статей */}
        <div className="card">
          <h3 className="heading-serif text-xl mb-3">Топ статей по просмотрам</h3>
          {topArticles.length === 0 ? (
            <p className="text-sm text-ink-500">Пока нет.</p>
          ) : (
            <ol className="space-y-2">
              {topArticles.map((a, i) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="text-ink-300 font-mono w-5 text-right">{i + 1}.</span>
                  <Link
                    href={`/knowledge/${a.slug}`}
                    className="flex-1 text-ink-700 hover:text-accent truncate"
                  >
                    {a.title}
                  </Link>
                  <span className="text-ink-400 text-xs shrink-0">{a.views} просм.</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Топ поисков */}
        <div className="card">
          <h3 className="heading-serif text-xl mb-3">Популярные запросы (30 дней)</h3>
          {topSearches.length === 0 ? (
            <p className="text-sm text-ink-500">Пока нет.</p>
          ) : (
            <ol className="space-y-2">
              {topSearches.map((s, i) => (
                <li key={s.query} className="flex items-center gap-3 text-sm">
                  <span className="text-ink-300 font-mono w-5 text-right">{i + 1}.</span>
                  <Link
                    href={`/search?q=${encodeURIComponent(s.query)}`}
                    className="flex-1 text-ink-700 hover:text-accent truncate"
                  >
                    {s.query}
                  </Link>
                  <span className="text-ink-400 text-xs shrink-0">{s._count.id}×</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  href,
}: {
  label: string;
  value: number;
  accent?: boolean;
  href?: string;
}) {
  const inner = (
    <div
      className={`card ${
        accent ? "border-accent/40 bg-accent/5" : ""
      } hover:border-accent transition`}
    >
      <div className={`heading-serif text-3xl ${accent ? "text-accent" : "text-ink-900"}`}>
        {value}
      </div>
      <div className="text-sm text-ink-500 mt-1">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
