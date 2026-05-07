import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "База знаний",
  description:
    "Готовые юридические ответы по жизненным ситуациям: трудовые споры, ДТП, семейное право, защита прав потребителей, уголовные дела и другие темы. Ссылки на нормы закона.",
  alternates: { canonical: "https://pravaimeu.ru/knowledge" },
  openGraph: {
    title: "База знаний · Права имею",
    description:
      "Готовые юридические ответы по жизненным ситуациям со ссылками на нормы закона.",
    url: "https://pravaimeu.ru/knowledge",
    type: "website",
  },
};

type Props = {
  searchParams: { category?: string };
};

export default async function KnowledgePage({ searchParams }: Props) {
  const activeSlug = searchParams.category;
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  const where = activeSlug
    ? { isPublished: true, category: { slug: activeSlug } }
    : { isPublished: true };
  const articles = await prisma.article.findMany({
    where,
    orderBy: [{ urgency: "desc" }, { title: "asc" }],
    include: { category: true },
  });

  const activeCat = categories.find((c) => c.slug === activeSlug);

  return (
    <div className="container-page py-10 md:py-14">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
          База знаний
        </p>
        <h1 className="heading-sans text-4xl md:text-5xl mb-3 text-ink-900 dark:text-white">
          {activeCat ? activeCat.title : "Все статьи"}
        </h1>
        <p className="text-ink-500 dark:text-ink-400 md:text-lg leading-relaxed">
          {activeCat
            ? activeCat.description
            : "Готовые юридические подсказки. Выберите категорию или используйте поиск."}
        </p>
      </div>

      <SearchBar size="md" />

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/knowledge" className={!activeSlug ? "chip-active" : "chip"}>
          Все · {articles.length}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/knowledge?category=${c.slug}`}
            className={c.slug === activeSlug ? "chip-active" : "chip"}
          >
            {c.title}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {articles.length === 0 ? (
          <div className="card md:col-span-2 text-center py-12">
            <p className="text-ink-400 font-medium">В этой категории пока нет статей.</p>
          </div>
        ) : (
          articles.map((a) => (
            <Link key={a.id} href={`/knowledge/${a.slug}`} className="card-hover group">
              <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400 mb-2">
                <span className="text-brand-500">
                  <CategoryIcon slug={a.category.slug} size={14} />
                </span>
                <span className="font-medium">{a.category.title}</span>
                {a.urgency >= 4 && (
                  <span className="badge bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300">
                    срочно
                  </span>
                )}
              </div>
              <h2 className="font-bold text-lg md:text-xl text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 line-clamp-3 leading-relaxed">
                {a.shortAnswer}
              </p>
              <p className="mt-3 text-sm text-brand-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Читать →
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
