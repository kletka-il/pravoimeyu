import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BOOKING_STATUS_LABEL, ROLE, type BookingStatus } from "@/lib/constants";
import BookingActions from "./BookingActions";

export const dynamic = "force-dynamic";

export default async function SpecialistBookings() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const profile = await prisma.specialistProfile.findUnique({
    where: { userId: s.userId },
  });
  if (!profile) return <div className="card">Профиль не найден.</div>;

  const bookings = await prisma.booking.findMany({
    where: { specialistId: profile.id },
    include: { client: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="heading-serif text-2xl">Обращения клиентов</h2>
      {bookings.length === 0 ? (
        <div className="card text-ink-500">
          Пока обращений нет. Они появятся здесь, когда клиент свяжется с вами по
          вашей специализации.
        </div>
      ) : (
        bookings.map((b) => (
          <article key={b.id} className="card">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-medium">{b.client.name}</div>
                <div className="text-xs text-ink-500">{b.client.email}</div>
                {b.contactPhone && (
                  <div className="text-xs text-ink-500">{b.contactPhone}</div>
                )}
              </div>
              <span className="badge bg-ink-100 text-ink-700 shrink-0">
                {BOOKING_STATUS_LABEL[b.status as BookingStatus]}
              </span>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed whitespace-pre-line">
              {b.question}
            </p>
            <BookingActions id={b.id} status={b.status as BookingStatus} />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-ink-400">
                Создано {b.createdAt.toLocaleString("ru-RU")}
              </div>
              <Link
                href={`/dashboard/specialist/bookings/${b.id}`}
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
