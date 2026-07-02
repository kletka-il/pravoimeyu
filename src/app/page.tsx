import { Suspense } from "react";
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
import { USERS_BASELINE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Права имею — юридическая помощь, когда она нужна срочно",
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  alternates: { canonical: "https://pravaimei.ru" },
  openGraph: {
    title: "Права имею — юридическая помощь, когда она нужна срочно",
    description:
      "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы.",
    url: "https://pravaimei.ru",
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
  url: "https://pravaimei.ru",
  logo: "https://pravaimei.ru/icons/icon-512.png",
  description:
    "Юридический портал — умный поиск по правовой базе, подсказки на жизненные ситуации и проверенные юристы.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Russian",
    url: "https://pravaimei.ru/contacts",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Права имею",
  url: "https://pravaimei.ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pravaimei.ru/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const EMPTY_HOME_DATA = {
  categories: [] as { id: string; slug: string; title: string; description: string; order: number }[],
  articlesCount: 0,
  specialistsCount: 0,
  usersCount: 0,
  topSpecialists: [] as { id: string; hasAvatar: boolean; rating: number; reviewsCount: number; city: string; yearsExperience: number; pricePerHour: number; user: { name: string } | null }[],
};

const getHomePageData = unstable_cache(
  async () => {
    const timeout = new Promise<typeof EMPTY_HOME_DATA>((resolve) =>
      setTimeout(() => resolve(EMPTY_HOME_DATA), 4000)
    );
    const query = async () => {
      const [categories, articlesCount, specialistsCount, usersCount, rawSpecialists] = await Promise.all([
        prisma.category.findMany({ orderBy: { order: "asc" } }),
        prisma.article.count({ where: { isPublished: true } }),
        prisma.specialistProfile.count({ where: { status: "APPROVED" } }),
        prisma.user.count(),
        prisma.specialistProfile.findMany({
          where: { status: "APPROVED" },
          orderBy: [{ rating: "desc" }, { reviewsCount: "desc" }],
          take: 4,
          select: {
            id: true,
            avatarUrl: true,
            rating: true,
            reviewsCount: true,
            city: true,
            yearsExperience: true,
            pricePerHour: true,
            user: { select: { name: true } },
          },
        }),
      ]);
      const topSpecialists = rawSpecialists.map(({ avatarUrl, ...s }) => ({
        ...s,
        hasAvatar: !!avatarUrl,
      }));
      return { categories, articlesCount, specialistsCount, usersCount, topSpecialists };
    };
    return Promise.race([query(), timeout]);
  },
  ["home-page-data-v2"],
  { revalidate: 300, tags: ["specialists"] }
);

export default function HomePage() {
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

      {/* ── Hero — рендерится мгновенно, без БД ── */}
      <section className="hero-surface border-b border-ink-900/[0.05] dark:border-white/[0.06]">
        <div className="container-page pt-12 pb-14 md:pt-20 md:pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="eyebrow mb-6">
              <span className="w-6 h-px bg-brand-600 dark:bg-brand-400" />
              Юридический сервис нового поколения
            </div>
            <h1 className="heading-sans text-[2.6rem] md:text-6xl lg:text-[4rem] mb-6 text-ink-900 dark:text-white">
              Ваши права.{" "}
              <span className="serif-accent text-brand-700 dark:text-brand-300">
                Наша забота.
              </span>
            </h1>
            <p className="text-ink-600 dark:text-ink-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Опишите ситуацию своими словами — найдём готовый ответ из
              правовой базы, а если случай сложный, подберём проверенного юриста.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2 mt-6 items-center">
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

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/10 via-transparent to-sun-400/10 blur-2xl pointer-events-none" />
            <Image
              src="/images/hero-client.png"
              alt="Юрист за работой"
              width={972}
              height={638}
              className="relative aspect-[3/2] w-full rounded-[2rem] shadow-deep border border-white/60 dark:border-white/10 overflow-hidden object-cover object-center"
              quality={85}
              priority
            />

            <div className="absolute -left-5 bottom-8 max-w-[270px] bg-white/95 dark:bg-ink-900/95 backdrop-blur rounded-3xl shadow-deep border border-ink-100 dark:border-white/10 p-4 animate-float">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-700 font-bold shrink-0">
                  А
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-0.5 mb-1">
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

            <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 bg-white/95 dark:bg-ink-900/95 backdrop-blur text-ink-900 dark:text-white text-xs font-semibold pl-2.5 pr-3.5 py-2 rounded-full shadow-lift border border-ink-100 dark:border-white/10">
              <ShieldCheck size={15} className="text-success-600" />
              Проверенные юристы
            </div>
          </div>
        </div>
      </section>

      {/* ── ИИ-помощник — тёмная сапфировая панель ── */}
      <section className="container-page py-10 md:py-12">
        <div className="panel-night px-6 py-9 md:px-12 md:py-12">
          <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                ИИ на базе Claude · Онлайн 24/7
              </div>
              <h2 className="heading-sans text-white text-3xl md:text-4xl mb-3">
                Спросите{" "}
                <span className="serif-accent text-sun-300">правового помощника</span>
              </h2>
              <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
                Опишите ситуацию своими словами — объясним ваши права, порядок
                действий и что делать дальше. Бесплатно.
              </p>
            </div>

            <AiPromoButtons />
          </div>
        </div>
      </section>

      {/* ── Данные из БД: Trust-полоса + Категории + Юристы ── */}
      <Suspense fallback={<DynamicSkeleton />}>
        <DynamicSections />
      </Suspense>

      {/* ── Как это работает ── */}
      <section className="container-page py-16 md:py-24">
        <div className="text-center mb-14">
          <p className="eyebrow justify-center mb-3">Как это работает</p>
          <h2 className="heading-sans text-3xl md:text-[2.6rem] text-ink-900 dark:text-white">
            Три шага до{" "}
            <span className="serif-accent text-brand-700 dark:text-brand-300">решения</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          <Step
            n="01"
            title="Опишите ситуацию"
            text="Обычным языком — как другу. «Попал в ДТП», «не платят зарплату», «закрыли въезд»."
          />
          <Step
            n="02"
            title="Получите ответ"
            text="Поиск выдаст готовый ответ из базы со ссылками на статьи закона. Бесплатно."
          />
          <Step
            n="03"
            title="Выберите юриста"
            text="Если случай сложный — подберём специалиста с нужным профилем. Только проверенные."
          />
        </div>
      </section>

      {/* ── CTA для юристов ── */}
      <section className="container-page pb-20 md:pb-24">
        <div className="panel-night p-8 md:p-14">
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <p className="eyebrow !text-sun-300 mb-3">Юристам</p>
              <h3 className="heading-sans text-white text-3xl md:text-4xl mb-3">
                Подключитесь{" "}
                <span className="serif-accent text-sun-300">к платформе</span>
              </h3>
              <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
                Получайте обращения по своей специализации, ведите кабинет,
                набирайте рейтинг.
              </p>
            </div>
            <Link
              href="/register?role=SPECIALIST"
              className="btn-gold shrink-0 whitespace-nowrap"
            >
              Стать юристом <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function formatUsers(n: number): string {
  // Округляем вниз до полусотни и показываем как «N+» — честное «более N».
  const rounded = Math.floor(n / 50) * 50;
  return `${rounded.toLocaleString("ru-RU")}+`;
}

async function DynamicSections() {
  const { categories, articlesCount, specialistsCount, usersCount, topSpecialists } = await getHomePageData();
  const totalUsers = USERS_BASELINE + usersCount;

  return (
    <>
      {/* ── Trust-полоса ── */}
      <section className="container-page pb-2">
        <div className="card !p-0 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink-100 dark:divide-white/[0.07] overflow-hidden">
          <TrustItem
            icon={<CheckCircle2 size={21} className="text-success-600" strokeWidth={2} />}
            big={articlesCount > 0 ? articlesCount.toString() : "—"}
            small="готовых ответов"
          />
          <TrustItem
            icon={<Users size={21} className="text-brand-600 dark:text-brand-300" strokeWidth={2} />}
            big={formatUsers(totalUsers)}
            small="пользователей сервиса"
          />
          <TrustItem
            icon={<ShieldCheck size={21} className="text-sun-600" strokeWidth={2} />}
            big={specialistsCount > 0 ? `${specialistsCount}+` : "Подбираем"}
            small="проверенных юристов"
          />
          <TrustItem
            icon={<Clock size={21} className="text-rose-600" strokeWidth={2} />}
            big="5 мин"
            small="среднее время ответа"
          />
        </div>
      </section>

      {/* ── Категории ── */}
      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Каталог ситуаций</p>
            <h2 className="heading-sans text-3xl md:text-[2.6rem] text-ink-900 dark:text-white">
              Жизненные{" "}
              <span className="serif-accent text-brand-700 dark:text-brand-300">ситуации</span>
            </h2>
            <p className="text-ink-500 mt-3 text-base md:text-lg">
              Выберите категорию — внутри готовые ответы и юристы.
            </p>
          </div>
          <Link href="/situations" className="hidden md:inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold text-sm hover:gap-3 transition-all">
            Все ситуации <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {categories.map((c) => {
            const col = CATEGORY_COLOR[c.slug] ?? {
              icon: "text-brand-700",
              bg: "bg-brand-50",
              darkBg: "dark:bg-brand-950",
            };
            return (
              <Link
                key={c.id}
                href={`/knowledge?category=${c.slug}`}
                className="tile p-6 flex items-start gap-4 group"
              >
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl ${col.bg} ${col.darkBg} flex items-center justify-center ${col.icon} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                >
                  <CategoryIcon slug={c.slug} size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors leading-snug mb-1">
                    {c.title}
                  </p>
                  <p className="text-sm text-ink-500 dark:text-ink-400 leading-snug">
                    {c.description}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 mt-1 text-ink-300 dark:text-ink-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-600 transition-all duration-200"
                />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/situations" className="btn-outline w-full justify-center">
            Все ситуации <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Юристы ── */}
      {topSpecialists.length > 0 && (
        <section className="section-soft border-y border-ink-900/[0.05] dark:border-white/[0.06]">
          <div className="container-page py-16 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">Команда</p>
                <h2 className="heading-sans text-3xl md:text-[2.6rem] text-ink-900 dark:text-white">
                  Проверенные{" "}
                  <span className="serif-accent text-brand-700 dark:text-brand-300">юристы</span>
                </h2>
                <p className="text-ink-500 mt-3 text-base md:text-lg">
                  Лицензия, опыт, реальные отзывы клиентов.
                </p>
              </div>
              <Link href="/specialists" className="hidden md:inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold text-sm hover:gap-3 transition-all">
                Все юристы <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {topSpecialists.map((s) => (
                <article key={s.id} className="tile group">
                  <div className="aspect-square w-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center overflow-hidden">
                    {s.hasAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/avatar/${s.id}`}
                        alt={s.user?.name ?? "Юрист"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-ink-300">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-1 mb-1.5">
                      {[0,1,2,3,4].map((i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < Math.round(s.rating || 0)
                              ? "fill-sun-400 text-sun-400"
                              : "text-ink-200 dark:text-ink-700"
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
                    <p className="text-xs text-ink-500 mt-0.5 mb-2.5 line-clamp-1">
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
                      className="block w-full text-center bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-700 hover:text-white dark:hover:bg-brand-700 font-semibold text-sm py-2.5 rounded-xl transition-colors"
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
    </>
  );
}

function DynamicSkeleton() {
  return (
    <>
      {/* Trust-полоса скелетон */}
      <section className="container-page pb-2">
        <div className="card !p-0 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink-100 dark:divide-white/[0.07] overflow-hidden">
          {[0,1,2,3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-5">
              <div className="w-11 h-11 rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-16 bg-ink-100 dark:bg-ink-800 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Категории скелетон */}
      <section className="container-page py-16 md:py-24">
        <div className="h-9 w-52 bg-ink-100 dark:bg-ink-800 rounded-xl mb-3 animate-pulse" />
        <div className="h-5 w-72 bg-ink-100 dark:bg-ink-800 rounded mb-10 animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="h-28 bg-ink-100 dark:bg-ink-800 rounded-3xl animate-pulse" />
          ))}
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
    <div className="flex items-center gap-3.5 p-5">
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-ink-50 dark:bg-white/[0.06] flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-extrabold text-ink-900 dark:text-white text-lg leading-tight">
          {big}
        </div>
        <div className="text-xs md:text-sm text-ink-500 leading-tight">{small}</div>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="card-hover relative pt-7">
      <div className="heading-display text-5xl font-bold text-brand-100 dark:text-brand-900 absolute top-5 right-6 select-none leading-none">
        {n}
      </div>
      <h3 className="font-bold text-lg text-ink-900 dark:text-white mb-2 relative">
        {title}
      </h3>
      <p className="text-ink-500 dark:text-ink-400 leading-relaxed text-sm md:text-base relative max-w-[85%]">
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
