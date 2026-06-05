import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleEditor from "@/components/ArticleEditor";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const article = await prisma.article.findFirst({
    where: { id: params.id, authorId: s.userId },
    include: { category: { select: { id: true, title: true, icon: true } } },
  });

  if (!article) notFound();

  const categories = await prisma.category.findMany({
    select: { id: true, title: true, icon: true },
    orderBy: { order: "asc" },
  });

  const keywords = (() => {
    const v = article.keywords;
    if (Array.isArray(v)) return v as string[];
    if (typeof v === "string") {
      try {
        return JSON.parse(v) as string[];
      } catch {
        return [];
      }
    }
    return [];
  })();

  const lawRefs = (() => {
    const v = article.lawRefs;
    if (Array.isArray(v)) return v as { label: string; ref: string }[];
    if (typeof v === "string") {
      try {
        return JSON.parse(v) as { label: string; ref: string }[];
      } catch {
        return [];
      }
    }
    return [];
  })();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <ArticleEditor
        articleId={article.id}
        initial={{
          title: article.title,
          shortAnswer: article.shortAnswer,
          body: article.body,
          categoryId: article.categoryId,
          urgency: article.urgency,
          keywords,
          lawRefs,
        }}
        categories={categories}
        savedAt={article.updatedAt}
        status={article.status ?? "DRAFT"}
        rejectionReason={article.rejectionReason ?? ""}
      />
    </div>
  );
}
