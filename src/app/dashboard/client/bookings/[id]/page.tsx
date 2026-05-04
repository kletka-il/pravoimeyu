import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BOOKING_STATUS_LABEL, ROLE, type BookingStatus } from "@/lib/constants";
import BookingChat from "@/components/BookingChat";
import BookingDocuments from "@/components/BookingDocuments";

export const dynamic = "force-dynamic";

export default async function ClientBookingDetail({
  params,
}: {
  params: { id: string };
}) {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.CLIENT) redirect("/dashboard");

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      specialist: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });
  if (!booking || booking.clientId !== s.userId) notFound();

  const statusClass =
    booking.status === "ACCEPTED" || booking.status === "IN_PROGRESS"
      ? "bg-green-100 text-green-800"
      : booking.status === "CLOSED"
        ? "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
        : booking.status === "CANCELLED"
          ? "bg-red-100 text-red-800"
          : "bg-amber-100 text-amber-800";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/dashboard/client/bookings" className="text-sm text-ink-500 hover:text-accent">
          ← Все обращения
        </Link>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm text-ink-500">Юрист</div>
            <div className="font-semibold text-lg">{booking.specialist.user.name}</div>
            <div className="text-xs text-ink-400 mt-0.5">
              {booking.specialist.city}{booking.specialist.city ? " · " : ""}
              стаж {booking.specialist.yearsExperience} лет ·
              {booking.specialist.pricePerHour
                ? ` ${booking.specialist.pricePerHour.toLocaleString("ru-RU")} ₽/час`
                : " стоимость по запросу"}
            </div>
          </div>
          <span className={`badge ${statusClass}`}>
            {BOOKING_STATUS_LABEL[booking.status as BookingStatus]}
          </span>
        </div>
        <div className="mt-4 border-t border-ink-100 pt-4">
          <div className="text-xs text-ink-400 mb-1">Ваш вопрос</div>
          <p className="text-ink-800 leading-relaxed whitespace-pre-line">{booking.question}</p>
        </div>
        <div className="text-xs text-ink-400 mt-3">
          Создано {new Date(booking.createdAt).toLocaleString("ru-RU")}
        </div>
      </div>

      {/* Оплата — заглушка */}
      {(booking.status === "ACCEPTED" || booking.status === "IN_PROGRESS") && (
        <div className="card border-gold/50 bg-gold/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold">Оплата консультации</div>
              <div className="text-sm text-ink-500 mt-1">
                Подключение онлайн-оплаты через YooKassa — в разработке.
                Свяжитесь с юристом напрямую для оплаты.
              </div>
            </div>
            <button
              disabled
              className="btn-outline text-sm opacity-50 cursor-not-allowed"
              title="Скоро будет доступно"
            >
              Оплатить онлайн (скоро)
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="heading-serif text-xl mb-4">Переписка</h3>
          <BookingChat bookingId={booking.id} currentUserId={s.userId} />
        </div>

        <div className="card">
          <h3 className="heading-serif text-xl mb-4">Документы</h3>
          <BookingDocuments bookingId={booking.id} currentUserId={s.userId} />
        </div>
      </div>
    </div>
  );
}
