import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SituationsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { articles: { where: { isPublished: true } } } },
    },
  });

  return (
    <div className="container-page py-12">
      <h1 className="heading-serif text-4xl md:text-5xl mb-3">
        Жизненные ситуации
      </h1>
      <p className="text-ink-500 max-w-2xl mb-10">
        Категории распределены по частым ситуациям, в которых может оказаться
        любой человек. Внутри каждой категории — пошаговые подсказки и юристы,
        которые ведут такие дела.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/knowledge?category=${c.slug}`}
            className="card hover:border-accent transition group"
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{c.icon}</div>
              <span className="badge bg-ink-100 text-ink-600">
                {c._count.articles} ст.
              </span>
            </div>
            <h2 className="heading-serif text-xl mt-3 group-hover:text-accent transition">
              {c.title}
            </h2>
            <p className="text-sm text-ink-500 mt-2">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
