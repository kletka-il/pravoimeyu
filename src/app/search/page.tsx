import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { searchArticles, type SearchHit } from "@/lib/search/index";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { q?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (searchParams.q || "").trim();
  if (q) {
    return {
      title: `${q} — поиск`,
      description: `Юридические ответы на вопрос: «${q}». Найдите решение своей правовой ситуации на портале «Право имею».`,
      openGraph: {
        title: `${q} — поиск · Право имею`,
        description: `Юридические ответы на вопрос: «${q}».`,
        url: `https://pravaimei.ru/search?q=${encodeURIComponent(q)}`,
      },
      robots: { index: false },
    };
  }
  return {
    title: "Поиск юридических ответов",
    description:
      "Опишите свою ситуацию — умный поиск найдёт готовые юридические ответы и подберёт специалиста с нужным опытом.",
    alternates: { canonical: "https://pravaimei.ru/search" },
    openGraph: {
      title: "Поиск юридических ответов · Право имею",
      description: "Опишите ситуацию своими словами — поиск найдёт готовый ответ из правовой базы.",
      url: "https://pravaimei.ru/search",
      type: "website",
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q || "").trim();
  let hits: SearchHit[] = [];
  if (q) hits = await searchArticles(q, 8);

  // Если поиск дал результаты — найдём юристов по специализациям топовых категорий
  let specialists: Awaited<ReturnType<typeof loadSpecialistsByCategory>> = [];
  if (hits.length > 0) {
    const topCategorySlugs = [...new Set(hits.slice(0, 3).map((h) => h.doc.category.slug))];
    specialists = await loadSpecialistsByCategory(topCategorySlugs);
  }

  // Самый срочный хит — если urgency >= 4
  const urgentTop = hits[0]?.doc.urgency >= 4 ? hits[0] : null;

  return (
    <div className="container-page py-10">
      <h1 className="heading-serif text-3xl md:text-4xl mb-6">
        Что мне делать?
      </h1>
      <SearchBar initial={q} />
      <p className="text-sm text-ink-500 mt-3">
        Опишите ситуацию своими словами — поиск понимает разговорные формулировки
        и юридические термины.
      </p>

      {!q && (
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <ExampleCard
            title="Например: «попал в аварию виноват не я»"
            body="Поиск найдёт памятку с шагами на месте ДТП, правилами оформления Европротокола и тем, как добиваться выплаты от страховой."
          />
          <ExampleCard
            title="Например: «не платят зарплату месяц»"
            body="Получите алгоритм: с 16-го дня — приостановка работы, жалоба в ГИТ, иск без госпошлины и компенсация по ст. 236 ТК."
          />
        </div>
      )}

      {q && (
        <>
          {urgentTop && (
            <div className="mt-8 border-l-4 border-accent bg-accent/5 p-4 rounded-r-md">
              <div className="badge bg-accent text-white">⚠ Срочно</div>
              <p className="mt-2 text-ink-800">
                По вашему запросу есть ситуация с высокой срочностью. Если
                ситуация развивается прямо сейчас — переходите к статье ниже и
                рассмотрите возможность связаться с юристом.
              </p>
            </div>
          )}

          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="heading-serif text-xl text-ink-700">
                {hits.length === 0
                  ? "Ничего не нашлось"
                  : `Найдено ответов: ${hits.length}`}
              </h2>
              {hits.length === 0 ? (
                <div className="card">
                  <p className="text-ink-700">
                    Попробуйте переформулировать запрос или выбрать категорию
                    вручную.
                  </p>
                  <div className="mt-4">
                    <Link href="/situations" className="btn-outline">
                      Все жизненные ситуации
                    </Link>
                  </div>
                </div>
              ) : (
                hits.map((h, i) => <HitCard key={h.doc.id} hit={h} idx={i} />)
              )}
            </div>

            <aside className="space-y-4">
              <div className="card">
                <h3 className="heading-serif text-xl mb-2">
                  Нужна помощь юриста?
                </h3>
                <p className="text-sm text-ink-500">
                  По вашему запросу мы подобрали специалистов с подходящим
                  опытом.
                </p>
                {specialists.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-400">
                    По категории не нашлось юристов — посмотрите всех в каталоге.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {specialists.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className="border border-ink-100 rounded-md p-3"
                      >
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
                    ))}
                  </div>
                )}
                <Link
                  href={`/login?next=${encodeURIComponent(`/search?q=${q}`)}`}
                  className="btn-primary w-full mt-4 text-sm"
                >
                  Связаться с юристом
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function ExampleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-accent font-semibold">
        Пример запроса
      </div>
      <div className="heading-serif text-xl mt-1">{title}</div>
      <p className="text-ink-600 mt-2">{body}</p>
    </div>
  );
}

function HitCard({ hit, idx }: { hit: SearchHit; idx: number }) {
  const u = hit.doc.urgency;
  return (
    <Link
      href={`/knowledge/${hit.doc.slug}`}
      className="card hover:border-accent transition block"
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="badge bg-ink-100 text-ink-700">
          #{idx + 1} в выдаче
        </span>
        <span className="text-ink-400">·</span>
        <span className="text-ink-500">{hit.doc.category.title}</span>
        {u >= 4 && (
          <span className="badge bg-accent text-white">⚠ срочно</span>
        )}
      </div>
      <h3 className="heading-serif text-2xl mt-2">{hit.doc.title}</h3>
      <p className="text-ink-700 mt-2 leading-relaxed">{hit.doc.shortAnswer}</p>
      {hit.highlights[0] && (
        <p className="text-sm text-ink-500 mt-3 border-l-2 border-ink-200 pl-3">
          {hit.highlights[0]}
        </p>
      )}
      <div className="mt-3 text-sm text-accent font-medium">Открыть статью →</div>
    </Link>
  );
}

async function loadSpecialistsByCategory(categorySlugs: string[]) {
  const cats = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } },
    select: { specializationKey: true },
  });
  const keys = [...new Set(cats.map((c) => c.specializationKey))];
  if (keys.length === 0) return [];
  const all = await prisma.specialistProfile.findMany({
    where: { status: "APPROVED" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ rating: "desc" }, { yearsExperience: "desc" }],
    take: 12,
  });
  // отфильтруем по специализациям
  const matched = all.filter((s) => {
    const list = (s.specializations as string[]) || [];
    return list.some((x) => keys.includes(x));
  });
  return matched.length > 0 ? matched : all.slice(0, 3);
}
