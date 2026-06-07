import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({ action: z.enum(["accept", "reject"]) });

export async function PATCH(
  req: Request,
  { params }: { params: { specialistId: string } },
) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }

  const firm = await prisma.lawFirm.findUnique({ where: { ownerId: session.userId! } });
  if (!firm) return NextResponse.json({ error: "Нет конторы" }, { status: 404 });

  const profile = await prisma.specialistProfile.findUnique({
    where: { id: params.specialistId },
  });
  if (!profile || profile.firmId !== firm.id) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });

  if (parsed.data.action === "accept") {
    await prisma.specialistProfile.update({
      where: { id: params.specialistId },
      data: { firmJoinStatus: "MEMBER" },
    });
  } else {
    await prisma.specialistProfile.update({
      where: { id: params.specialistId },
      data: { firmId: null, firmJoinStatus: "" },
    });
  }

  return NextResponse.json({ ok: true });
}
