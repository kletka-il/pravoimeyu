import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { ROLE } from "@/lib/constants";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

async function getBookingDoc(bookingId: string, docId: string, userId: string, role: string) {
  const doc = await prisma.document.findUnique({
    where: { id: docId },
    include: {
      booking: { include: { specialist: { select: { userId: true } } } },
    },
  });
  if (!doc || doc.bookingId !== bookingId) return null;
  const isClient = doc.booking.clientId === userId;
  const isSpecialist = doc.booking.specialist.userId === userId;
  const isAdmin = role === ROLE.ADMIN;
  if (!isClient && !isSpecialist && !isAdmin) return null;
  return doc;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string; docId: string } },
) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return new NextResponse("Нужно войти", { status: 401 });
  }
  const doc = await getBookingDoc(params.id, params.docId, s.userId!, s.role!);
  if (!doc) return new NextResponse("Не найдено", { status: 404 });

  const filePath = path.join(process.cwd(), "uploads", doc.path);
  let buffer: Buffer;
  try {
    buffer = await fs.readFile(filePath);
  } catch {
    return new NextResponse("Файл не найден на сервере", { status: 404 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(buffer.length),
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; docId: string } },
) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  const doc = await getBookingDoc(params.id, params.docId, s.userId!, s.role!);
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Только загрузивший или admin может удалить
  if (doc.uploaderId !== s.userId && s.role !== ROLE.ADMIN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "uploads", doc.path);
  await fs.unlink(filePath).catch(() => {});
  await prisma.document.delete({ where: { id: doc.id } });
  return NextResponse.json({ ok: true });
}
