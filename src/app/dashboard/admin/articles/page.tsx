import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ArticleRowActions from "./ArticleRowActions";
import ModerationActions from "./ModerationActions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");

  const [pendingArticles, allArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PENDING" },
      include: {
        category: true,
        author: { select: { name: true, email: true } },
      },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.article.findMany({
      include: {
        category: true,
        author: { select: { name: true } },
      },
      orderBy: [{ urgency: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="heading-serif text-2xl">Статьи базы знаний</h2>
        <Link href="/dashboard/admin/articles/new" className="btn-primary text-sm py-2 px-4">
          + Новая статья
        </Link>
      </div>

      {/* Moderation queue */}
      {pendingArticles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="heading-serif text-xl">Требуют проверки</h3>
            <span className="badge bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              {pendingArticles.length}
            </span>
          </div>
          <div className="card p-0 overflow-hidden divide-y divide-ink-100 dark:divide-ink-800 border-amber-200 dark:border-amber-800">
            {pendingArticles.map((a) => (
              <div key={a.id} className="px-5 py-4 bg-amber-50/40 dark:bg-amber-950/20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/admin/articles/${a.id}`}
                      className="font-semibold hover:text-accent transition-colors"
                    >
                      {a.title || <span className="text-ink-400 italic">Без заголовка</span>}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-ink-500">
                      <span>{a.category.icon} {a.category.title}</span>
                      {a.author && (
                        <span className="flex items-center gap-1">
                          <span className="text-ink-400">Автор:</span>
                          <span className="font-medium text-ink-700 dark:text-ink-300">
                            {a.author.name}
                          </span>
                        </span>
                      )}
                      <span>
                        {new Date(a.updatedAt).toLocaleDateString("ru", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {a.shortAnswer && (
                      <p className="text-sm text-ink-600 dark:text-ink-400 mt-2 line-clamp-2">
                        {a.shortAnswer}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 min-w-[200px]">
                    <ModerationActions articleId={a.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All articles table */}
      <div className="space-y-3">
        <h3 className="heading-serif text-xl">Все статьи</h3>
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3">Заголовок</th>
                <th className="text-left px-4 py-3">Категория</th>
                <th className="text-left px-4 py-3">Автор</th>
                <th className="text-left px-4 py-3">Срочн.</th>
                <th className="text-left px-4 py-3">Просм.</th>
                <th className="text-left px-4 py-3">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {allArticles.map((a) => (
                <tr key={a.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/20">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/articles/${a.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {a.title}
                    </Link>
                    <div className="text-xs text-ink-400">/{a.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-600 dark:text-ink-400">
                    {a.category.icon} {a.category.title}
                  </td>
                  <td className="px-4 py-3 text-ink-500 text-xs">
                    {a.author?.name ?? <span className="text-ink-300">—</span>}
                  </td>
                  <td className="px-4 py-3">{a.urgency}</td>
                  <td className="px-4 py-3">{a.views}</td>
                  <td className="px-4 py-3">
                    <ArticleStatusBadge
                      isPublished={a.isPublished}
                      status={a.status ?? "APPROVED"}
                    />
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
    </div>
  );
}

function ArticleStatusBadge({
  isPublished,
  status,
}: {
  isPublished: boolean;
  status: string;
}) {
  if (status === "PENDING") {
    return (
      <span className="badge bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
        На проверке
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="badge bg-red-100 dark:bg-red-950 text-accent">
        Отклонено
      </span>
    );
  }
  if (status === "DRAFT") {
    return (
      <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400">
        Черновик
      </span>
    );
  }
  return isPublished ? (
    <span className="badge bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
      Опубликовано
    </span>
  ) : (
    <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
      Скрыто
    </span>
  );
}
