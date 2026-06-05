import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";
import { sendEmail, buildNewBookingEmail } from "@/lib/email";

export const runtime = "nodejs";

const schema = z.object({
  specialistId: z.string().min(1),
  question: z.string().min(10).max(4000),
  contactPhone: z.string().max(40).optional(),
  fromChat: z.boolean().optional(),
});

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.CLIENT);
  } catch {
    return NextResponse.json({ error: "Нужно войти как клиент" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  const profile = await prisma.specialistProfile.findUnique({
    where: { id: parsed.data.specialistId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!profile || profile.status !== "APPROVED") {
    return NextResponse.json({ error: "Юрист недоступен" }, { status: 404 });
  }

  const client = await prisma.user.findUnique({
    where: { id: s.userId! },
    select: { name: true },
  });

  const booking = await prisma.booking.create({
    data: {
      clientId: s.userId!,
      specialistId: profile.id,
      question: parsed.data.question,
      contactPhone: parsed.data.contactPhone ?? "",
      status: "NEW",
      fromChat: parsed.data.fromChat ?? false,
    },
  });

  // Уведомляем юриста — ошибка письма не блокирует ответ
  try {
    const { text, html } = buildNewBookingEmail(
      profile.user.name,
      client?.name ?? "Клиент",
      parsed.data.question,
      booking.id,
    );
    await sendEmail({
      to: profile.user.email,
      subject: "Новое обращение — Права имею",
      text,
      html,
    });
  } catch (e) {
    console.error("Booking email error:", e);
  }

  return NextResponse.json({ ok: true, id: booking.id });
}
