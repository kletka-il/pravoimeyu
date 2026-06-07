export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import CategoryIcon, { CATEGORY_COLOR } from "@/components/CategoryIcon";
import AiPromoButtons from "@/components/AiPromoButtons";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import {
  CheckCircle2, Clock, ShieldCheck, Users, Star, ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Права имею — юридическая помощь, когда она нужна срочно",
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  alternates: { canonical: "https://pravaimeu.ru" },
  openGraph: {
    title: "Права имею — юридическая помощь, когда она нужна срочно",
    description:
      "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы.",
    url: "https://pravaimeu.ru",
    type: "website",
  },
};

const POPULAR_QUERIES = [
  "Попал в ДТП, виноват не я",
  "Не платят зарплату",
  "Уволили незаконно",
  "Звонят коллекторы",
  "Затопили соседи",
  "Хочу подать на развод",
  "Вернуть товар в магазин",
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Права имею",
  url: "https://pravaimeu.ru",
  logo: "https://pravaimeu.ru/icons/icon-512.png",
  description:
    "Юридический портал — умный поиск по правовой базе, подсказки на жизненные ситуации и проверенные юристы.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Russian",
    url: "https://pravaimeu.ru/contacts",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Права имею",
  url: "https://pravaimeu.ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pravaimeu.ru/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const getHomePageData = unstable_cache(
  async () => {
    const [categories, articlesCount, specialistsCount, topSpecialists] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.article.count({ where: { isPublished: true } }),
      prisma.specialistProfile.count({ where: { status: "APPROVED" } }),
      prisma.specialistProfile.findMany({
        where: { status: "APPROVED" },
        orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
        take: 4,
        include: { user: { select: { name: true } } },
        // avatarUrl is on the profile itself
      }),
    ]);
    return { categories, articlesCount, specialistsCount, topSpecialists };
  },
  ["home-page-data"],
  { revalidate: 300, tags: ["specialists"] }
);

export default async function HomePage() {
  const { categories, articlesCount, specialistsCount, topSpecialists } = await getHomePageData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />

      {/* ── Hero — две колонки: слева текст+поиск, справа фото счастливого клиента ── */}
      <section className="border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950">
        <div className="container-page py-10 md:py-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Левая колонка — текст и поиск */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun-100 text-sun-800 text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sun-500" />
              Юридический маркетплейс
            </div>
            <h1 className="heading-sans text-4xl md:text-5xl lg:text-6xl mb-5 text-ink-900 dark:text-white">
              Юридическая помощь —{" "}
              <span className="text-brand-700 dark:text-brand-400">
                просто и понятно
              </span>
            </h1>
            <p className="text-ink-600 dark:text-ink-400 text-lg md:text-xl mb-7 max-w-xl leading-relaxed">
              Опишите ситуацию своими словами. Найдём готовый ответ из базы знаний,
              а если случай сложный — подберём проверенного юриста.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2 mt-5 items-center">
              <span className="text-sm text-ink-500 mr-1">Часто ищут:</span>
              {POPULAR_QUERIES.map((q) => (
                <Link
                  key={q}
                  href={`/search?q=${encodeURIComponent(q)}`}
                  className="chip"
                >
                  {q}
                </Link>
              ))}
            </div>
          </div>

          {/* Правая колонка — слот под фото счастливого клиента */}
          <div className="relative hidden lg:block">
            <Image
              src="/images/hero-client.png"
              alt="Юрист за работой"
              width={972}
              height={638}
              className="aspect-[3/2] w-full rounded-3xl shadow-card border border-ink-100 dark:border-ink-800 overflow-hidden object-cover object-center"
              quality={85}
            />

            {/* Карточка-отзыв поверх фото снизу-слева */}
            <div className="absolute -left-4 bottom-6 max-w-[260px] bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-ink-100 dark:border-ink-800 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold shrink-0">
                  А
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[0,1,2,3,4].map((i) => (
                      <Star key={i} size={12} className="fill-sun-400 text-sun-400" />
                    ))}
                  </div>
                  <p className="text-sm text-ink-800 dark:text-ink-200 leading-snug font-medium">
                    «Вернула 47 000 ₽ за просрочку — за 2 недели»
                  </p>
                  <p className="text-xs text-ink-500 mt-1">Анна, Москва</p>
                </div>
              </div>
            </div>

            {/* Стикер trust справа-сверху */}
            <div className="absolute -top-3 -right-2 bg-success-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-soft">
              ✓ Проверенные юристы
            </div>
          </div>
        </div>
      </section>

      {/* ── ИИ-помощник промо-блок ── */}
      <section className="container-page py-8 md:py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white px-6 py-8 md:px-10 md:py-10">
          {/* Декор */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                ИИ на базе Claude · Онлайн 24/7
              </div>
              <h2 className="font-extrabold text-2xl md:text-3xl leading-tight mb-2">
                Спросите правового<br className="hidden sm:block" /> ИИ-помощника
              </h2>
              <p className="text-white/75 text-sm md:text-base max-w-md">
                Опишите ситуацию своими словами — объясним ваши права, порядок действий и что делать дальше. Бесплатно.
              </p>
            </div>

            <AiPromoButtons />
          </div>
        </div>
      </section>

      {/* ── Trust-полоса: 4 факта с иконками ── */}
      <section className="border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/60">
        <div className="container-page py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <TrustItem
              icon={<CheckCircle2 size={22} className="text-success-600" strokeWidth={2} />}
              big={articlesCount.toString()}
              small="готовых ответов"
            />
            <TrustItem
              icon={<Clock size={22} className="text-brand-700" strokeWidth={2} />}
              big="5 мин"
              small="среднее время ответа"
            />
            <TrustItem
              icon={<Users size={22} className="text-sun-600" strokeWidth={2} />}
              big={specialistsCount > 0 ? `${specialistsCount}+` : "Подбираем"}
              small="проверенных юристов"
            />
            <TrustItem
              icon={<ShieldCheck size={22} className="text-rose-600" strokeWidth={2} />}
              big="100%"
              small="конфиденциально"
            />
          </div>
        </div>
      </section>

      {/* ── Категории как товарные плитки ── */}
      <section className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
              Жизненные ситуации
            </h2>
            <p className="text-ink-500 mt-2 text-base md:text-lg">
              Выберите категорию — внутри готовые ответы и юристы.
            </p>
          </div>
          <Link href="/situations" className="hidden md:inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-400 font-semibold text-sm hover:gap-2.5 transition-all">
            Все ситуации <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((c, idx) => {
            const col = CATEGORY_COLOR[c.slug] ?? {
              icon: "text-brand-700",
              bg: "bg-brand-50",
              darkBg: "dark:bg-brand-950",
            };
            // Помечаем первые две и одну особую — стикерами для разнообразия
            const sticker =
              c.slug === "dtp-i-gibdd"     ? { cls: "sticker-urgent",  text: "Срочно" } :
              c.slug === "krediti-i-dolgi" ? { cls: "sticker-popular", text: "Популярно" } :
              c.slug === "trudovye-spory"  ? { cls: "sticker-free",    text: "Бесплатно" } :
              null;

            return (
              <Link
                key={c.id}
                href={`/knowledge?category=${c.slug}`}
                className="tile p-5 flex items-start gap-4 group"
              >
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl ${col.bg} ${col.darkBg} flex items-center justify-center ${col.icon} transition-transform group-hover:scale-110`}
                >
                  <CategoryIcon slug={c.slug} size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug">
                      {c.title}
                    </p>
                    {sticker && (
                      <span className={`sticker ${sticker.cls}`}>{sticker.text}</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-500 dark:text-ink-400 leading-snug">
                    {c.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/situations" className="btn-outline w-full justify-center">
            Все ситуации <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Юристы — карточки, как товары на маркетплейсе ── */}
      {topSpecialists.length > 0 && (
        <section className="section-soft border-y border-ink-100 dark:border-ink-800">
          <div className="container-page py-14 md:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
                  Проверенные юристы
                </h2>
                <p className="text-ink-500 mt-2 text-base md:text-lg">
                  Лицензия, опыт, реальные отзывы клиентов.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {topSpecialists.map((s) => (
                <article key={s.id} className="tile">
                  {/* Аватар */}
                  <div className="aspect-square w-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center overflow-hidden">
                    {s.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.avatarUrl} alt={s.user?.name ?? "Юрист"} className="w-full h-full object-cover" />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-ink-300">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {[0,1,2,3,4].map((i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < Math.round(s.rating || 0)
                              ? "fill-sun-400 text-sun-400"
                              : "text-ink-200"
                          }
                        />
                      ))}
                      {s.reviewsCount > 0 && (
                        <span className="text-xs text-ink-500 ml-1">
                          ({s.reviewsCount})
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-ink-900 dark:text-white leading-snug truncate">
                      {s.user?.name ?? "Юрист"}
                    </p>
                    <p className="text-xs text-ink-500 mt-0.5 mb-2 line-clamp-1">
                      {s.city || "Онлайн"} · опыт {s.yearsExperience} {pluralYears(s.yearsExperience)}
                    </p>
                    {s.pricePerHour > 0 && (
                      <div className="text-base font-extrabold text-ink-900 dark:text-white mb-3">
                        от {s.pricePerHour.toLocaleString("ru-RU")} ₽
                        <span className="text-xs text-ink-500 font-medium">/час</span>
                      </div>
                    )}
                    <Link
                      href={`/specialists/${s.id}`}
                      className="block w-full text-center bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 font-semibold text-sm py-2 rounded-lg transition-colors"
                    >
                      Связаться
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Как это работает — три дружелюбных шага ── */}
      <section className="container-page py-14 md:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest mb-2">
            Как это работает
          </p>
          <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
            Три шага до решения
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <Step
            n="1"
            title="Опишите ситуацию"
            text="Обычным языком — как другу. «Попал в ДТП», «не платят зарплату», «закрыли въезд»."
          />
          <Step
            n="2"
            title="Получите ответ"
            text="Поиск выдаст готовый ответ из базы со ссылками на статьи закона. Бесплатно."
          />
          <Step
            n="3"
            title="Выберите юриста"
            text="Если случай сложный — подберём специалиста с нужным профилем. Только проверенные."
          />
        </div>
      </section>

      {/* ── CTA для юристов ── */}
      <section className="container-page pb-16 md:pb-20">
        <div className="rounded-3xl gradient-brand p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-sun-300 text-xs font-bold uppercase tracking-widest mb-2">
                Юристам
              </p>
              <h3 className="heading-sans text-2xl md:text-3xl text-white mb-2">
                Подключитесь к платформе
              </h3>
              <p className="text-white/80 text-base md:text-lg max-w-xl">
                Получайте обращения по своей специализации, ведите кабинет, набирайте рейтинг.
              </p>
            </div>
            <Link
              href="/register?role=SPECIALIST"
              className="shrink-0 bg-sun-400 hover:bg-sun-500 text-ink-900 px-6 py-3.5 rounded-xl font-bold shadow-cta active:scale-[0.98] transition-all whitespace-nowrap inline-flex items-center gap-2"
            >
              Стать юристом <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function TrustItem({
  icon,
  big,
  small,
}: {
  icon: React.ReactNode;
  big: string;
  small: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-center shadow-soft">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-extrabold text-ink-900 dark:text-white text-base md:text-lg leading-tight">
          {big}
        </div>
        <div className="text-xs md:text-sm text-ink-500 leading-tight">{small}</div>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="relative bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-6 shadow-card hover:shadow-lift transition-shadow">
      <div className="absolute -top-3 -left-3 w-9 h-9 rounded-xl bg-sun-400 text-ink-900 font-extrabold text-base flex items-center justify-center shadow-cta">
        {n}
      </div>
      <h3 className="font-bold text-lg text-ink-900 dark:text-white mb-2 mt-2">
        {title}
      </h3>
      <p className="text-ink-500 dark:text-ink-400 leading-relaxed text-sm md:text-base">
        {text}
      </p>
    </div>
  );
}

function pluralYears(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "лет";
  if (mod10 === 1) return "год";
  if (mod10 >= 2 && mod10 <= 4) return "года";
  return "лет";
}
