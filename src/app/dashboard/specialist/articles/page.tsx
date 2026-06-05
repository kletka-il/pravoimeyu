import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import { StatusBadge } from "@/components/ArticleEditor";

export const dynamic = "force-dynamic";

export default async function SpecialistArticlesPage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.SPECIALIST) redirect("/dashboard");

  const articles = await prisma.article.findMany({
    where: { authorId: s.userId },
    include: { category: { select: { title: true, icon: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const byStatus: Record<string, typeof articles> = {
    PENDING: [],
    REJECTED: [],
    DRAFT: [],
    APPROVED: [],
  };

  for (const a of articles) {
    const st = a.status ?? "DRAFT";
    if (byStatus[st]) byStatus[st].push(a);
    else byStatus["DRAFT"].push(a);
  }

  const sections: { status: string; label: string; articles: typeof articles }[] = [
    { status: "PENDING", label: "На проверке", articles: byStatus.PENDING },
    { status: "REJECTED", label: "Отклонены", articles: byStatus.REJECTED },
    { status: "DRAFT", label: "Черновики", articles: byStatus.DRAFT },
    { status: "APPROVED", label: "Опубликованы", articles: byStatus.APPROVED },
  ].filter((s) => s.articles.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="heading-serif text-2xl">Мои статьи</h2>
        <Link
          href="/dashboard/specialist/articles/new"
          className="btn-primary text-sm py-2 px-4"
        >
          + Новая статья
        </Link>
      </div>

      {articles.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="heading-serif text-xl mb-2">Начните делиться знаниями</h3>
          <p className="text-ink-500 text-sm max-w-md mx-auto mb-6">
            Напишите статью в базу знаний — это поможет тысячам людей разобраться
            в правовых ситуациях, а ваш профиль станет более заметным.
          </p>
          <Link
            href="/dashboard/specialist/articles/new"
            className="btn-primary"
          >
            Написать первую статью
          </Link>
        </div>
      )}

      {sections.map(({ status, label, articles: list }) => (
        <div key={status} className="space-y-3">
          <h3 className="font-semibold text-ink-700 dark:text-ink-300 text-sm uppercase tracking-wide">
            {label} ({list.length})
          </h3>
          <div className="card p-0 overflow-hidden divide-y divide-ink-100 dark:divide-ink-800">
            {list.map((a) => (
              <div key={a.id} className="px-5 py-4 hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <StatusBadge status={a.status ?? "DRAFT"} />
                      <span className="text-xs text-ink-400">
                        {a.category.icon} {a.category.title}
                      </span>
                      <span className="text-xs text-ink-400">
                        {new Date(a.updatedAt).toLocaleDateString("ru", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/specialist/articles/${a.id}`}
                      className="font-semibold hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                    >
                      {a.title || <span className="text-ink-400 italic">Без заголовка</span>}
                    </Link>
                    {a.rejectionReason && (
                      <p className="text-sm text-accent mt-1 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">
                        <span className="font-medium">Причина отказа:</span>{" "}
                        {a.rejectionReason}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/specialist/articles/${a.id}`}
                    className="text-sm text-brand-700 dark:text-brand-400 hover:underline shrink-0"
                  >
                    {a.status === "DRAFT" || a.status === "REJECTED"
                      ? "Редактировать"
                      : "Просмотреть"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
