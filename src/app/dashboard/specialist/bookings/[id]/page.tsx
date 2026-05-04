import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BOOKING_STATUS_LABEL, ROLE, type BookingStatus } from "@/lib/constants";
import BookingChat from "@/components/BookingChat";
import BookingDocuments from "@/components/BookingDocuments";
import BookingActions from "../BookingActions";

export const dynamic = "force-dynamic";

export default async function SpecialistBookingDetail({
  params,
}: {
  params: { id: string };
}) {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const profile = await prisma.specialistProfile.findUnique({ where: { userId: s.userId } });
  if (!profile) redirect("/dashboard");

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { client: { select: { name: true, email: true, phone: true } } },
  });
  if (!booking || booking.specialistId !== profile.id) notFound();

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
      <Link href="/dashboard/specialist/bookings" className="text-sm text-ink-500 hover:text-accent">
        ← Все обращения
      </Link>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm text-ink-500">Клиент</div>
            <div className="font-semibold text-lg">{booking.client.name}</div>
            <div className="text-xs text-ink-400 mt-0.5">
              {booking.client.email}
              {booking.client.phone ? ` · ${booking.client.phone}` : ""}
              {booking.contactPhone ? ` · ${booking.contactPhone}` : ""}
            </div>
          </div>
          <span className={`badge ${statusClass}`}>
            {BOOKING_STATUS_LABEL[booking.status as BookingStatus]}
          </span>
        </div>
        <div className="mt-4 border-t border-ink-100 pt-4">
          <div className="text-xs text-ink-400 mb-1">Вопрос клиента</div>
          <p className="text-ink-800 leading-relaxed whitespace-pre-line">{booking.question}</p>
        </div>
        <BookingActions id={booking.id} status={booking.status as BookingStatus} />
        <div className="text-xs text-ink-400 mt-3">
          Создано {new Date(booking.createdAt).toLocaleString("ru-RU")}
        </div>
      </div>

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
