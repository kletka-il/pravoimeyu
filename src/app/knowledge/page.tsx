import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "База знаний",
  description:
    "Готовые юридические ответы по жизненным ситуациям: трудовые споры, ДТП, семейное право, защита прав потребителей, уголовные дела и другие темы. Ссылки на нормы закона.",
  alternates: { canonical: "https://pravaimeu.ru/knowledge" },
  openGraph: {
    title: "База знаний · Право имею",
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
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

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
    <div className="container-page py-10 md:py-12">
      <div className="inline-flex items-center gap-2 bg-mint-50 text-mint-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
        База знаний
      </div>
      <h1 className="heading-display text-4xl md:text-5xl mb-3">
        {activeCat ? `${activeCat.icon} ${activeCat.title}` : "База знаний 📚"}
      </h1>
      <p className="text-ink-500 max-w-2xl mb-6 md:text-lg">
        {activeCat
          ? activeCat.description
          : "Все юридические подсказки. Выберите категорию или используйте умный поиск."}
      </p>
      <SearchBar size="md" />

      <div className="mt-8 flex flex-wrap gap-2">
        <CategoryChip
          href="/knowledge"
          active={!activeSlug}
          title={`Все · ${articles.length}`}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            href={`/knowledge?category=${c.slug}`}
            active={c.slug === activeSlug}
            title={`${c.icon} ${c.title}`}
          />
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {articles.length === 0 ? (
          <div className="card md:col-span-2 text-center py-10">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-ink-700">В этой категории пока нет статей.</p>
          </div>
        ) : (
          articles.map((a) => (
            <Link
              key={a.id}
              href={`/knowledge/${a.slug}`}
              className="card-hover group"
            >
              <div className="text-xs text-ink-500 flex items-center gap-2 flex-wrap">
                <span className="text-lg">{a.category.icon}</span>
                <span className="font-medium">{a.category.title}</span>
                {a.urgency >= 4 && (
                  <span className="badge bg-accent-100 text-accent-700">⚠ срочно</span>
                )}
              </div>
              <h2 className="font-bold text-lg md:text-xl mt-2 text-ink-900 group-hover:text-brand-700 transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-ink-600 mt-2 line-clamp-3 leading-relaxed">
                {a.shortAnswer}
              </p>
              <div className="mt-3 text-sm text-brand-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Читать →
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  href,
  active,
  title,
}: {
  href: string;
  active: boolean;
  title: string;
}) {
  return (
    <Link href={href} className={active ? "chip-active" : "chip"}>
      {title}
    </Link>
  );
}
