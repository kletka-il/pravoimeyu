import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";
import { SPECIALIZATIONS } from "@/lib/data/categories";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!a) return { title: "Статья не найдена" };
  return { title: a.title, description: a.shortAnswer };
}

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!article || !article.isPublished) notFound();

  // Похожие статьи в той же категории
  const related = await prisma.article.findMany({
    where: {
      isPublished: true,
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    take: 4,
    orderBy: { urgency: "desc" },
  });

  // Подходящие юристы по специализации категории
  const specialists = await prisma.specialistProfile.findMany({
    where: { status: "APPROVED" },
    include: { user: { select: { name: true } } },
    orderBy: [{ rating: "desc" }, { yearsExperience: "desc" }],
  });
  const specKey = article.category.specializationKey;
  const matchedSpecialists = specialists
    .filter((s) => ((s.specializations as string[]) || []).includes(specKey))
    .slice(0, 3);

  // увеличиваем счётчик просмотров
  void prisma.article
    .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const lawRefs = (article.lawRefs as Array<{ label: string; ref: string }>) || [];
  const html = markdownToHtml(article.body);

  return (
    <div className="container-page py-10">
      <div className="text-sm text-ink-500 flex items-center gap-2 mb-6">
        <Link href="/knowledge" className="hover:text-accent">
          ← База знаний
        </Link>
        <span>·</span>
        <Link
          href={`/knowledge?category=${article.category.slug}`}
          className="hover:text-accent"
        >
          {article.category.icon} {article.category.title}
        </Link>
      </div>

      <article className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h1 className="heading-serif text-3xl md:text-5xl mb-4">
            {article.title}
          </h1>
          {article.urgency >= 4 && (
            <div className="border-l-4 border-accent bg-accent/5 p-4 rounded-r-md mb-6">
              <div className="badge bg-accent text-white">⚠ Срочная ситуация</div>
              <p className="mt-2 text-ink-800">
                Если ситуация развивается прямо сейчас — действуйте по
                инструкции и параллельно свяжитесь с юристом.
              </p>
            </div>
          )}
          <div className="bg-white border border-ink-100 rounded-md p-5 mb-6">
            <div className="text-xs uppercase text-accent font-semibold tracking-wide">
              Что делать в двух словах
            </div>
            <p className="text-ink-900 text-lg mt-2 leading-relaxed">
              {article.shortAnswer}
            </p>
          </div>
          <div
            className="prose-legal"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {lawRefs.length > 0 && (
            <div className="mt-10 border-t border-ink-100 pt-6">
              <h3 className="heading-serif text-xl mb-3">Ссылки на закон</h3>
              <ul className="space-y-1 text-sm">
                {lawRefs.map((r, i) => (
                  <li key={i}>
                    <a
                      href={r.ref}
                      target="_blank"
                      rel="noopener nofollow"
                      className="text-accent underline underline-offset-2"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 border-t border-ink-100 pt-6 text-sm text-ink-500">
            Информация носит справочный характер и не заменяет индивидуальной
            консультации. Для оценки конкретной ситуации обратитесь к юристу.
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h3 className="heading-serif text-xl mb-2">Нужен юрист по этому вопросу?</h3>
            <p className="text-sm text-ink-500">
              Подобрали специалистов с опытом по специализации
              «{SPECIALIZATIONS[specKey] ?? "Общая практика"}».
            </p>
            <div className="mt-4 space-y-3">
              {matchedSpecialists.length === 0 ? (
                <p className="text-sm text-ink-400">
                  Сейчас нет свободных. Попробуйте позже.
                </p>
              ) : (
                matchedSpecialists.map((s) => (
                  <div key={s.id} className="border border-ink-100 rounded-md p-3">
                    <div className="font-semibold">{s.user.name}</div>
                    <div className="text-xs text-ink-500">
                      {s.city} · стаж {s.yearsExperience} лет
                    </div>
                    <div className="text-xs text-ink-500 mt-1">
                      ★ {s.rating.toFixed(1)} ({s.reviewsCount} отзывов)
                    </div>
                    <div className="text-sm mt-1">
                      {s.pricePerHour
                        ? `${s.pricePerHour.toLocaleString("ru-RU")} ₽/час`
                        : "Стоимость по запросу"}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link
              href={`/login?next=${encodeURIComponent(`/knowledge/${article.slug}`)}`}
              className="btn-primary w-full mt-4 text-sm"
            >
              Связаться с юристом
            </Link>
          </div>
          {related.length > 0 && (
            <div className="card">
              <h3 className="heading-serif text-xl mb-2">Похожие статьи</h3>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/knowledge/${r.slug}`}
                      className="text-sm text-ink-700 hover:text-accent block"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </div>
  );
}
