import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

// Подать заявку на вступление в фирму
export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = z.object({ firmId: z.string().min(1) }).safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Укажите фирму" }, { status: 400 });

  const firm = await prisma.lawFirm.findUnique({ where: { id: parsed.data.firmId } });
  if (!firm || firm.status !== "APPROVED") {
    return NextResponse.json({ error: "Фирма не найдена или не одобрена" }, { status: 404 });
  }

  await prisma.specialistProfile.update({
    where: { userId: s.userId! },
    data: { firmId: parsed.data.firmId, firmJoinStatus: "PENDING" },
  });

  return NextResponse.json({ ok: true });
}

// Отозвать заявку или покинуть фирму
export async function DELETE() {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  await prisma.specialistProfile.update({
    where: { userId: s.userId! },
    data: { firmId: null, firmJoinStatus: "" },
  });

  return NextResponse.json({ ok: true });
}
