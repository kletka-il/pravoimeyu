import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

async function checkAccess(bookingId: string, userId: string, role: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { specialist: { select: { userId: true } } },
  });
  if (!booking) return null;
  const isClient = booking.clientId === userId;
  const isSpecialist = booking.specialist.userId === userId;
  const isAdmin = role === ROLE.ADMIN;
  if (!isClient && !isSpecialist && !isAdmin) return null;
  return booking;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  const booking = await checkAccess(params.id, s.userId!, s.role!);
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { bookingId: params.id },
    include: { sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

const sendSchema = z.object({ text: z.string().trim().min(1).max(4000) });

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  const booking = await checkAccess(params.id, s.userId!, s.role!);
  if (!booking) return NextResponse.json({ error: "not found" }, { status: 404 });

  const json = await req.json().catch(() => null);
  const parsed = sendSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      bookingId: params.id,
      senderId: s.userId!,
      text: parsed.data.text,
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });
  return NextResponse.json(message);
}
