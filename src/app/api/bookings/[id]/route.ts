import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { BOOKING_STATUS, ROLE } from "@/lib/constants";
import { sendEmail, buildBookingStatusEmail } from "@/lib/email";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum([
    BOOKING_STATUS.NEW,
    BOOKING_STATUS.ACCEPTED,
    BOOKING_STATUS.IN_PROGRESS,
    BOOKING_STATUS.CLOSED,
    BOOKING_STATUS.CANCELLED,
  ]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      specialist: { include: { user: { select: { name: true } } } },
      client: { select: { name: true, email: true } },
    },
  });
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });

  const isClient = booking.clientId === s.userId;
  const isSpecialist = booking.specialist.userId === s.userId;
  const isAdmin = s.role === ROLE.ADMIN;
  if (!isClient && !isSpecialist && !isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: parsed.data.status },
  });

  // Уведомление клиенту при изменении статуса специалистом или админом
  if (!isClient && ["ACCEPTED", "IN_PROGRESS", "CLOSED", "CANCELLED"].includes(parsed.data.status)) {
    const { text, html } = buildBookingStatusEmail(
      booking.client.name,
      booking.specialist.user.name,
      parsed.data.status,
      booking.question,
    );
    sendEmail({
      to: booking.client.email,
      subject: `Обращение «Право имею»: статус изменён`,
      text,
      html,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
