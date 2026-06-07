import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }

  const firm = await prisma.lawFirm.findUnique({ where: { ownerId: session.userId! } });
  if (!firm) return NextResponse.json({ error: "Нет конторы" }, { status: 404 });

  const members = await prisma.specialistProfile.findMany({
    where: { firmId: firm.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { firmJoinStatus: "asc" },
  });

  return NextResponse.json({ firm, members });
}
