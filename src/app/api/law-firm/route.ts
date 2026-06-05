import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "Название слишком короткое").max(200),
  inn: z.string().trim().min(10, "ИНН должен быть 10 или 12 цифр").max(12),
  address: z.string().trim().min(5, "Укажите адрес").max(300),
  phone: z.string().trim().max(40).default(""),
  website: z.string().trim().max(200).default(""),
  description: z.string().trim().max(2000).default(""),
});

export async function POST(req: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
  }

  const existing = await prisma.lawFirm.findUnique({ where: { ownerId: session.userId! } });
  if (existing) {
    return NextResponse.json({ error: "У вас уже есть зарегистрированная контора" }, { status: 400 });
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

  const firm = await prisma.lawFirm.create({
    data: {
      ...parsed.data,
      ownerId: session.userId!,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, id: firm.id });
}

export async function GET(req: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }

  const firm = await prisma.lawFirm.findUnique({ where: { ownerId: session.userId! } });
  return NextResponse.json({ firm });
}
