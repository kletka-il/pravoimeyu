import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AiSearchAnswer from "@/components/AiSearchAnswer";
import { searchArticles, type SearchHit } from "@/lib/search/index";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
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
      description: `Юридические ответы на вопрос: «${q}». Найдите решение своей правовой ситуации на портале «Права имею».`,
      openGraph: {
        title: `${q} — поиск · Права имею`,
        description: `Юридические ответы на вопрос: «${q}».`,
        url: `https://pravaimeu.ru/search?q=${encodeURIComponent(q)}`,
      },
      robots: { index: false },
    };
  }
  return {
    title: "Поиск юридических ответов",
    description:
      "Опишите свою ситуацию — умный поиск найдёт готовые юридические ответы и подберёт специалиста с нужным опытом.",
    alternates: { canonical: "https://pravaimeu.ru/search" },
    openGraph: {
      title: "Поиск юридических ответов · Права имею",
      description: "Опишите ситуацию своими словами — поиск найдёт готовый ответ из правовой базы.",
      url: "https://pravaimeu.ru/search",
      type: "website",
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q || "").trim();
  const session = await getSession();
  const isAuthenticated = !!session.userId;
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
    <div className="container-page py-10 md:py-12">
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
        Умный поиск
      </div>
      <h1 className="heading-sans text-3xl md:text-5xl mb-3 text-ink-900 dark:text-white">
        Что мне делать?
      </h1>
      <p className="text-ink-500 mb-6 md:text-lg max-w-2xl">
        Опишите ситуацию своими словами — поиск понимает разговорные формулировки
        и юридические термины.
      </p>
      <SearchBar initial={q} enforceGuestLimit={!isAuthenticated} />

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
            <div className="mt-8 bg-accent-50 border border-accent-200 rounded-2xl p-5 flex gap-4 items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-accent-500" />
              <div>
                <div className="font-bold text-accent-900">Срочная ситуация</div>
                <p className="mt-1 text-ink-800 text-sm leading-relaxed">
                  По вашему запросу есть ситуация с высокой срочностью. Если
                  это происходит прямо сейчас — открывайте статью ниже и
                  рассмотрите возможность связаться с юристом.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-lg text-ink-700">
                {hits.length === 0
                  ? "Ничего не нашлось"
                  : `Найдено ответов: ${hits.length}`}
              </h2>
              {hits.length === 0 ? (
                <div className="card space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-600 text-lg">✦</span>
                    <span className="font-bold text-ink-900 dark:text-white">
                      Ответ ИИ-помощника
                    </span>
                  </div>
                  <AiSearchAnswer query={q} />
                  <div className="pt-3 border-t border-ink-100 dark:border-ink-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <p className="text-xs text-ink-400">
                      Ответ носит информационный характер. Для решения вашей ситуации рекомендуем проконсультироваться с юристом.
                    </p>
                    <Link href="/situations" className="btn-outline text-sm whitespace-nowrap">
                      Все ситуации →
                    </Link>
                  </div>
                </div>
              ) : (
                hits.map((h, i) => <HitCard key={h.doc.id} hit={h} idx={i} />)
              )}
            </div>

            <aside className="space-y-4">
              <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 rounded-2xl p-6">
                <h3 className="font-bold text-xl mb-2 text-ink-900 dark:text-white">
                  Нужна помощь юриста?
                </h3>
                <p className="text-sm text-ink-600">
                  Мы подобрали специалистов с подходящим опытом.
                </p>
                {specialists.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-500">
                    По категории не нашлось юристов — посмотрите всех в каталоге.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {specialists.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className="bg-white border border-ink-100 rounded-xl p-3"
                      >
                        <div className="font-bold text-ink-900">{s.user.name}</div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {s.city} · стаж {(() => { const n = s.yearsExperience; const m = n % 10; const h = n % 100; if (h >= 11 && h <= 14) return `${n} лет`; if (m === 1) return `${n} год`; if (m >= 2 && m <= 4) return `${n} года`; return `${n} лет`; })()}
                        </div>
                        <div className="text-xs text-sun-600 font-semibold mt-1">
                          ★ {s.rating.toFixed(1)} ({s.reviewsCount} отзывов)
                        </div>
                        <div className="text-sm mt-1 text-ink-700">
                          {s.pricePerHour
                            ? `${s.pricePerHour.toLocaleString("ru-RU")} ₽/час`
                            : "По запросу"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href={isAuthenticated ? "/contacts" : `/login?next=${encodeURIComponent(`/search?q=${q}`)}`}
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
    <div className="card-hover">
      <div className="text-xs uppercase tracking-widest text-brand-600 font-bold">
        Пример запроса
      </div>
      <div className="font-bold text-lg mt-1.5 text-ink-900">{title}</div>
      <p className="text-ink-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

function HitCard({ hit, idx }: { hit: SearchHit; idx: number }) {
  const u = hit.doc.urgency;
  return (
    <Link
      href={`/knowledge/${hit.doc.slug}`}
      className="card-hover block group"
    >
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="badge bg-brand-100 text-brand-700">
          #{idx + 1}
        </span>
        <span className="text-ink-400">·</span>
        <span className="text-ink-500">{hit.doc.category.title}</span>
        {u >= 4 && (
          <span className="badge bg-accent-500 text-white">срочно</span>
        )}
      </div>
      <h3 className="font-bold text-xl md:text-2xl mt-2 text-ink-900 group-hover:text-brand-700 transition-colors">
        {hit.doc.title}
      </h3>
      <p className="text-ink-700 mt-2 leading-relaxed">{hit.doc.shortAnswer}</p>
      {hit.highlights[0] && (
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-3 bg-ink-50 dark:bg-ink-800 rounded-xl px-3 py-2">
          {hit.highlights[0]}
        </p>
      )}
      <div className="mt-3 text-sm text-brand-600 font-semibold group-hover:text-brand-700">
        Открыть статью →
      </div>
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
    const raw = s.specializations;
    const list: string[] = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
        ? (() => { try { return JSON.parse(raw); } catch { return []; } })()
        : [];
    return list.some((x) => keys.includes(x));
  });
  return matched.length > 0 ? matched : all.slice(0, 3);
}
