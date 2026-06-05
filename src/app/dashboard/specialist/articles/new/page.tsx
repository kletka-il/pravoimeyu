import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleEditor from "@/components/ArticleEditor";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const categories = await prisma.category.findMany({
    select: { id: true, title: true, icon: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <ArticleEditor categories={categories} />
    </div>
  );
}
