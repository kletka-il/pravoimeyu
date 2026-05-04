import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleRowActions from "./ArticleRowActions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");

  const articles = await prisma.article.findMany({
    include: { category: true },
    orderBy: [{ urgency: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading-serif text-2xl">Статьи базы знаний</h2>
        <Link href="/dashboard/admin/articles/new" className="btn-primary text-sm py-2 px-4">
          + Новая статья
        </Link>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Заголовок</th>
              <th className="text-left px-4 py-3">Категория</th>
              <th className="text-left px-4 py-3">Срочн.</th>
              <th className="text-left px-4 py-3">Просм.</th>
              <th className="text-left px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-ink-50/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/admin/articles/${a.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {a.title}
                  </Link>
                  <div className="text-xs text-ink-400">/{a.slug}</div>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {a.category.icon} {a.category.title}
                </td>
                <td className="px-4 py-3">{a.urgency}</td>
                <td className="px-4 py-3">{a.views}</td>
                <td className="px-4 py-3">
                  {a.isPublished ? (
                    <span className="badge bg-green-100 text-green-800">Опубликовано</span>
                  ) : (
                    <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">Черновик</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ArticleRowActions id={a.id} isPublished={a.isPublished} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
