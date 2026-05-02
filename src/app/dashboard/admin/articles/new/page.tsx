import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleForm from "../ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-4">
      <h2 className="heading-serif text-2xl">Новая статья</h2>
      <ArticleForm
        categories={categories.map((c) => ({ id: c.id, title: c.title }))}
        initial={null}
      />
    </div>
  );
}
