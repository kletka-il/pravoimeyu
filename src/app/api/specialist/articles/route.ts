import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Transliterate Cyrillic → Latin for slug generation
function transliterate(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return str
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

function generateSlug(title: string): string {
  const raw = transliterate(title)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${raw || "article"}-${randomSuffix()}`;
}

const createSchema = z.object({
  title: z.string().trim().min(1).default(""),
  shortAnswer: z.string().trim().default(""),
  body: z.string().trim().default(""),
  categoryId: z.string().default(""),
  urgency: z.coerce.number().int().min(1).max(5).default(2),
  keywords: z.array(z.string()).default([]),
  lawRefs: z
    .array(z.object({ label: z.string(), ref: z.string() }))
    .default([]),
});

export async function GET() {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const articles = await prisma.article.findMany({
    where: { authorId: s.userId },
    include: { category: { select: { id: true, title: true, icon: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }

  const slug = generateSlug(parsed.data.title || "черновик");

  // categoryId is required by DB FK — must be a real category id if provided
  if (parsed.data.categoryId && parsed.data.categoryId !== "") {
    const cat = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Категория не найдена" }, { status: 400 });
    }
  }

  // For new draft, if no categoryId provided, we use the first available category
  let categoryId = parsed.data.categoryId;
  if (!categoryId) {
    const firstCat = await prisma.category.findFirst({ orderBy: { order: "asc" } });
    if (!firstCat) {
      return NextResponse.json({ error: "Нет доступных категорий" }, { status: 400 });
    }
    categoryId = firstCat.id;
  }

  try {
    const article = await prisma.article.create({
      data: {
        slug,
        title: parsed.data.title,
        shortAnswer: parsed.data.shortAnswer,
        body: parsed.data.body,
        categoryId,
        urgency: parsed.data.urgency,
        keywords: parsed.data.keywords,
        lawRefs: parsed.data.lawRefs,
        isPublished: false,
        status: "DRAFT",
        authorId: s.userId,
      },
    });
    return NextResponse.json({ article });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка создания";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
