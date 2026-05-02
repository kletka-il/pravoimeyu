import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug — только латиница, цифры и дефисы"),
  title: z.string().trim().min(3),
  shortAnswer: z.string().trim().min(10),
  body: z.string().trim().min(20),
  categoryId: z.string().min(1),
  urgency: z.coerce.number().int().min(1).max(5),
  isPublished: z.boolean().default(true),
  keywords: z.array(z.string()).default([]),
  lawRefs: z.array(z.object({ label: z.string(), ref: z.string().url() })).default([]),
});

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.ADMIN);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  try {
    await prisma.article.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        shortAnswer: parsed.data.shortAnswer,
        body: parsed.data.body,
        categoryId: parsed.data.categoryId,
        urgency: parsed.data.urgency,
        isPublished: parsed.data.isPublished,
        keywords: parsed.data.keywords,
        lawRefs: parsed.data.lawRefs,
        authorId: s.userId,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e instanceof Error && e.message.includes("Unique") ? "Slug занят" : "Ошибка";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
