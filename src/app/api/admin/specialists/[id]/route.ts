import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE, SPECIALIST_STATUS } from "@/lib/constants";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum([
    SPECIALIST_STATUS.PENDING,
    SPECIALIST_STATUS.APPROVED,
    SPECIALIST_STATUS.REJECTED,
    SPECIALIST_STATUS.SUSPENDED,
  ]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireRole(ROLE.ADMIN);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad" }, { status: 400 });
  const exists = await prisma.specialistProfile.findUnique({
    where: { id: params.id },
  });
  if (!exists) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.specialistProfile.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });
  revalidateTag("specialists");
  return NextResponse.json({ ok: true });
}
