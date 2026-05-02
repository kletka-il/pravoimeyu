import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  specialistId: z.string().min(1),
  question: z.string().min(10).max(4000),
  contactPhone: z.string().max(40).optional(),
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
  });
  if (!profile || profile.status !== "APPROVED") {
    return NextResponse.json({ error: "Юрист недоступен" }, { status: 404 });
  }
  const booking = await prisma.booking.create({
    data: {
      clientId: s.userId!,
      specialistId: profile.id,
      question: parsed.data.question,
      contactPhone: parsed.data.contactPhone ?? "",
      status: "NEW",
    },
  });
  return NextResponse.json({ ok: true, id: booking.id });
}
