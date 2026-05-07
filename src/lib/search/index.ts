import { prisma } from "@/lib/prisma";
import { buildIndex, isIndexBuilt, search, type SearchHit } from "./engine";

let lastBuilt = 0;
let buildingPromise: Promise<void> | null = null;
const TTL = 60_000; // пересобирать индекс не чаще раза в минуту

async function rebuild(): Promise<void> {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    include: { category: { select: { slug: true, title: true } } },
  });

  buildIndex(
    articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      shortAnswer: a.shortAnswer,
      body: a.body,
      keywords: (a.keywords as string[]) || [],
      category: a.category,
      urgency: a.urgency,
    })),
  );

  lastBuilt = Date.now();
}

export async function ensureIndex(): Promise<void> {
  const now = Date.now();
  if (isIndexBuilt() && now - lastBuilt < TTL) return;
  if (buildingPromise) return buildingPromise;
  buildingPromise = rebuild().finally(() => {
    buildingPromise = null;
  });
  return buildingPromise;
}

export async function searchArticles(
  query: string,
  limit = 8,
): Promise<SearchHit[]> {
  await ensureIndex();
  return search(query, limit);
}

export { type SearchHit } from "./engine";
