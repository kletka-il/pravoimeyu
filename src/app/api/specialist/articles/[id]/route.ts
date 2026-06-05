import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getOwnedArticle(id: string, userId: string) {
  return prisma.article.findFirst({
    where: { id, authorId: userId },
    include: { category: { select: { id: true, title: true, icon: true } } },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const article = await getOwnedArticle(params.id, s.userId!);
  if (!article) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

const patchSchema = z.object({
  title: z.string().trim().optional(),
  shortAnswer: z.string().trim().optional(),
  body: z.string().trim().optional(),
  categoryId: z.string().optional(),
  urgency: z.coerce.number().int().min(1).max(5).optional(),
  keywords: z.array(z.string()).optional(),
  lawRefs: z
    .array(z.object({ label: z.string(), ref: z.string() }))
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const article = await getOwnedArticle(params.id, s.userId!);
  if (!article) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.article.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ article: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка обновления";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const article = await getOwnedArticle(params.id, s.userId!);
  if (!article) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  if (article.status !== "DRAFT") {
    return NextResponse.json(
      { error: "Можно удалять только черновики" },
      { status: 400 },
    );
  }

  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
