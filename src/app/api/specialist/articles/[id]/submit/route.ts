import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const article = await prisma.article.findFirst({
    where: { id: params.id, authorId: s.userId },
  });

  if (!article) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  if (article.status !== "DRAFT" && article.status !== "REJECTED") {
    return NextResponse.json(
      { error: "Статья уже отправлена или опубликована" },
      { status: 400 },
    );
  }

  // Validate required fields
  const errors: string[] = [];
  if (!article.title || article.title.trim().length < 3) {
    errors.push("Заголовок: минимум 3 символа");
  }
  if (!article.shortAnswer || article.shortAnswer.trim().length < 50) {
    errors.push("Краткий ответ: минимум 50 символов");
  }
  if (!article.body || article.body.trim().length < 200) {
    errors.push("Текст статьи: минимум 200 символов");
  }
  if (!article.categoryId) {
    errors.push("Выберите категорию");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Не заполнены обязательные поля", errors },
      { status: 400 },
    );
  }

  const updated = await prisma.article.update({
    where: { id: params.id },
    data: { status: "PENDING", rejectionReason: "" },
  });

  return NextResponse.json({ article: updated });
}
