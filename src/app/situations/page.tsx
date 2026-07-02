import Link from "next/link";
import CategoryIcon, { CATEGORY_COLOR } from "@/components/CategoryIcon";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Жизненные ситуации",
  description:
    "Юридические ситуации по категориям: трудовые споры, ДТП, семейное право, жильё, защита прав потребителей и другие. Пошаговые подсказки и юристы по каждой теме.",
  alternates: { canonical: "https://pravaimei.ru/situations" },
  openGraph: {
    title: "Жизненные ситуации · Права имею",
    description:
      "Юридические ситуации по категориям: трудовые споры, ДТП, семейное право, жильё, защита прав потребителей и другие.",
    url: "https://pravaimei.ru/situations",
    type: "website",
  },
};

export default async function SituationsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { articles: { where: { isPublished: true } } } },
    },
  });

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-3">
          Категории
        </p>
        <h1 className="heading-sans text-4xl md:text-5xl mb-3 text-ink-900 dark:text-white">
          Жизненные ситуации
        </h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg leading-relaxed">
          Категории распределены по частым ситуациям, в которых может оказаться
          любой человек. Внутри каждой — пошаговые подсказки и юристы по теме.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => {
          const col = CATEGORY_COLOR[c.slug] ?? { icon: "text-brand-600", bg: "bg-brand-50", darkBg: "dark:bg-brand-950" };
          return (
          <Link
            key={c.id}
            href={`/knowledge?category=${c.slug}`}
            className="group flex flex-col gap-3 p-5 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lift transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${col.bg} ${col.darkBg} flex items-center justify-center ${col.icon} transition-colors`}>
                <CategoryIcon slug={c.slug} size={18} />
              </div>
              <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 text-xs">
                {c._count.articles} ст.
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug">
                {c.title}
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 leading-snug">{c.description}</p>
            </div>
          </Link>
        );})}
      </div>
    </div>
  );
}
