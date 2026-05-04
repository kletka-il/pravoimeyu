import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Наши победы",
  description:
    "Реальные дела юристов «Право имею»: выигранные суды, взысканные компенсации, восстановленные права. Примеры успешных дел по трудовым, семейным и гражданским спорам.",
  alternates: { canonical: "https://pravaimeu.ru/wins" },
  openGraph: {
    title: "Наши победы · Право имею",
    description:
      "Реальные дела юристов «Право имею»: выигранные суды, взысканные компенсации, восстановленные права.",
    url: "https://pravaimeu.ru/wins",
    type: "website",
  },
};

export default async function WinsPage() {
  const wins = await prisma.win.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <div className="container-page py-12">
      <h1 className="heading-serif text-4xl md:text-5xl mb-3">Наши победы</h1>
      <p className="text-ink-500 max-w-2xl mb-10">
        Реальные дела наших юристов. Имена клиентов и точные суммы изменены
        там, где это требует закон. Истории показывают, что добиться результата
        возможно — даже там, где ситуация казалась безвыходной.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {wins.map((w) => (
          <article key={w.id} className="card">
            <div className="text-xs uppercase tracking-wide text-accent font-semibold">
              {w.category}
            </div>
            <h2 className="heading-serif text-2xl mt-2">{w.title}</h2>
            <p className="text-ink-700 mt-2">{w.summary}</p>
            <p className="text-ink-600 mt-3 text-sm leading-relaxed">{w.body}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-cream border border-gold/30 px-3 py-2 rounded">
              <span className="text-gold-light">★</span>
              <span className="font-semibold text-ink-900">{w.amount}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
