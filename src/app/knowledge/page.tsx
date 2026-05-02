import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

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
    <div className="container-page py-12">
      <h1 className="heading-serif text-4xl md:text-5xl mb-3">База знаний</h1>
      <p className="text-ink-500 max-w-2xl mb-6">
        {activeCat
          ? activeCat.description
          : "Все юридические подсказки портала. Выберите категорию или используйте умный поиск."}
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
          <div className="card md:col-span-2">
            <p className="text-ink-700">В этой категории пока нет статей.</p>
          </div>
        ) : (
          articles.map((a) => (
            <Link
              key={a.id}
              href={`/knowledge/${a.slug}`}
              className="card hover:border-accent transition group"
            >
              <div className="text-xs text-ink-500 flex items-center gap-2">
                <span>{a.category.icon}</span>
                <span>{a.category.title}</span>
                {a.urgency >= 4 && (
                  <span className="badge bg-accent/10 text-accent">⚠ срочно</span>
                )}
              </div>
              <h2 className="heading-serif text-xl mt-2 group-hover:text-accent transition">
                {a.title}
              </h2>
              <p className="text-sm text-ink-600 mt-2 line-clamp-3">
                {a.shortAnswer}
              </p>
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
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-sm border transition ${
        active
          ? "bg-accent text-white border-accent"
          : "bg-white text-ink-700 border-ink-200 hover:border-accent hover:text-accent"
      }`}
    >
      {title}
    </Link>
  );
}
