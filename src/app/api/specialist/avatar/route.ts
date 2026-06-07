import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const base64: unknown = json?.base64;

  if (typeof base64 !== "string" || !base64.startsWith("data:image/")) {
    return NextResponse.json({ error: "Неверный формат" }, { status: 400 });
  }
  if (base64.length > 300_000) {
    return NextResponse.json({ error: "Файл слишком большой" }, { status: 400 });
  }

  await prisma.specialistProfile.update({
    where: { userId: s.userId! },
    data: { avatarUrl: base64 },
  });

  return NextResponse.json({ ok: true });
}
