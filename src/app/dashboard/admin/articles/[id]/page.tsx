import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleForm from "../ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");
  const a = await prisma.article.findUnique({ where: { id: params.id } });
  if (!a) notFound();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-4">
      <h2 className="heading-serif text-2xl">Редактировать статью</h2>
      <ArticleForm
        categories={categories.map((c) => ({ id: c.id, title: c.title }))}
        initial={{
          id: a.id,
          slug: a.slug,
          title: a.title,
          shortAnswer: a.shortAnswer,
          body: a.body,
          keywords: (a.keywords as string[]) || [],
          lawRefs: (a.lawRefs as Array<{ label: string; ref: string }>) || [],
          urgency: a.urgency,
          categoryId: a.categoryId,
          isPublished: a.isPublished,
        }}
      />
    </div>
  );
}
