import { NextResponse } from "next/server";
import { searchArticles } from "@/lib/search/index";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ hits: [], specializations: [] });

  const hits = await searchArticles(q, 8);

  // Лог запроса
  try {
    const session = await getSession();
    await prisma.searchLog.create({
      data: {
        query: q.slice(0, 500),
        userId: session.userId ?? null,
        resultsCount: hits.length,
        topArticleId: hits[0]?.doc.id ?? null,
      },
    });
  } catch {
    /* лог некритичен */
  }

  return NextResponse.json({
    hits: hits.map((h) => ({
      id: h.doc.id,
      slug: h.doc.slug,
      title: h.doc.title,
      shortAnswer: h.doc.shortAnswer,
      categorySlug: h.doc.category.slug,
      categoryTitle: h.doc.category.title,
      urgency: h.doc.urgency,
      score: Math.round(h.score * 10) / 10,
      snippet: h.highlights[0] || "",
    })),
  });
}
