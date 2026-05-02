import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

const patchSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug — только латиница, цифры и дефисы")
    .optional(),
  title: z.string().trim().min(3).optional(),
  shortAnswer: z.string().trim().min(10).optional(),
  body: z.string().trim().min(20).optional(),
  categoryId: z.string().min(1).optional(),
  urgency: z.coerce.number().int().min(1).max(5).optional(),
  isPublished: z.boolean().optional(),
  keywords: z.array(z.string()).optional(),
  lawRefs: z
    .array(z.object({ label: z.string(), ref: z.string().url() }))
    .optional(),
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
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка" },
      { status: 400 },
    );
  }
  try {
    await prisma.article.update({ where: { id: params.id }, data: parsed.data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireRole(ROLE.ADMIN);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  await prisma.article.delete({ where: { id: params.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
