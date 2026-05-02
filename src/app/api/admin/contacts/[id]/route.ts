import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({ isRead: z.boolean() });

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
  await prisma.contact.update({
    where: { id: params.id },
    data: { isRead: parsed.data.isRead },
  });
  return NextResponse.json({ ok: true });
}
