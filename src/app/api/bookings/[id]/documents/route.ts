import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { ROLE } from "@/lib/constants";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024; // 10 МБ

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

  const docs = await prisma.document.findMany({
    where: { bookingId: params.id },
    include: { uploader: { select: { name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(docs);
}

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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл превышает 10 МБ" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^\w.а-яА-ЯёЁ-]/g, "_").slice(0, 120);
  const fileName = `${Date.now()}-${safeName}`;
  const dir = path.join(process.cwd(), "uploads", params.id);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  let doc;
  try {
    doc = await prisma.document.create({
      data: {
        bookingId: params.id,
        uploaderId: s.userId!,
        name: file.name,
        path: path.join(params.id, fileName),
        size: file.size,
      },
      include: { uploader: { select: { name: true, role: true } } },
    });
  } catch {
    await fs.unlink(filePath).catch(() => {});
    return NextResponse.json({ error: "Ошибка сохранения файла" }, { status: 500 });
  }
  return NextResponse.json(doc);
}
