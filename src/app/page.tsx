import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryIcon from "@/components/CategoryIcon";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Право имею — юридическая помощь, когда она нужна срочно",
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  alternates: { canonical: "https://pravaimeu.ru" },
  openGraph: {
    title: "Право имею — юридическая помощь, когда она нужна срочно",
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
  "Задержали в полиции",
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Право имею",
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
  name: "Право имею",
  url: "https://pravaimeu.ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pravaimeu.ru/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const [categories, articlesCount, specialistsCount] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.specialistProfile.count({ where: { status: "APPROVED" } }),
  ]);

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

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-ink-100 dark:border-ink-800">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 100% -10%, rgba(124,58,237,0.10), transparent)," +
              "radial-gradient(ellipse 500px 400px at -5% 110%, rgba(220,38,38,0.06), transparent)",
          }}
        />
        <div className="container-page pt-14 md:pt-24 pb-14 md:pb-20">
          <div className="max-w-3xl">
            <p className="font-display text-brand-600 dark:text-brand-400 text-xl md:text-2xl mb-3 tracking-wide">
              Право имею
            </p>
            <h1 className="heading-sans text-4xl md:text-6xl lg:text-7xl mb-6 text-ink-900 dark:text-white">
              Что вам делать —{" "}
              <span className="text-brand-600 dark:text-brand-400">мы знаем</span>
            </h1>
            <p className="text-ink-500 dark:text-ink-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Опишите ситуацию своими словами. Найдём готовый ответ из правовой
              базы, а если случай сложный — подберём юриста.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2 mt-5 items-center">
              <span className="text-sm text-ink-400 mr-1">Часто ищут:</span>
              {POPULAR_QUERIES.map((q) => (
                <Link key={q} href={`/search?q=${encodeURIComponent(q)}`} className="chip">
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950">
        <div className="container-page py-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink-100 dark:divide-ink-800">
            <StatItem value={articlesCount}     label="готовых ответов" />
            <StatItem value={categories.length} label="категорий" />
            <StatItem value={specialistsCount}  label="проверенных юристов" />
            <StatItem value="24 / 7"            label="доступ онлайн" />
          </dl>
        </div>
      </section>

      {/* ── Категории ── */}
      <section className="container-page py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
              Жизненные ситуации
            </h2>
            <p className="text-ink-500 mt-2 text-base md:text-lg">
              Выберите категорию — внутри готовые ответы и юристы.
            </p>
          </div>
          <Link href="/situations" className="hidden md:inline-flex btn-outline text-sm">
            Все ситуации →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/knowledge?category=${c.slug}`}
              className="group flex items-start gap-4 p-5 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lift transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900 transition-colors">
                <CategoryIcon slug={c.slug} size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug">
                  {c.title}
                </p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/situations" className="btn-outline w-full justify-center">
            Все ситуации →
          </Link>
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section className="border-t border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/60">
        <div className="container-page py-16 md:py-20">
          <div className="mb-12">
            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              Три шага
            </p>
            <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
              Как это работает
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-ink-200 dark:bg-ink-700 rounded-2xl overflow-hidden">
            <Step n="01" title="Опишите ситуацию"
              text="Обычным языком — как рассказали бы другу. «Попал в ДТП», «не платят зарплату», «закрыли въезд»." />
            <Step n="02" title="Получите ответ"
              text="Поиск выдаст подсказку из правовой базы со ссылками на статьи закона. Бесплатно." />
            <Step n="03" title="Выберите юриста"
              text="Если вопрос сложный — подберём специалиста с нужным профилем и опытом. Только проверенные." />
          </div>
        </div>
      </section>

      {/* ── CTA для юристов ── */}
      <section className="container-page py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 md:p-12 text-white">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 500px 300px at 110% 0%, rgba(220,38,38,0.8), transparent)",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Юристам</p>
              <h3 className="heading-sans text-2xl md:text-3xl text-white mb-2">
                Подключитесь к платформе
              </h3>
              <p className="text-white/70 text-base md:text-lg max-w-xl">
                Получайте обращения по своей специализации, ведите личный кабинет,
                набирайте рейтинг и отзывы.
              </p>
            </div>
            <Link
              href="/register?role=SPECIALIST"
              className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3.5 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Стать юристом →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatItem({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="px-6 py-4 first:pl-0 last:pr-0 text-center md:text-left">
      <dd className="text-2xl md:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
        {value}
      </dd>
      <dt className="text-xs md:text-sm text-ink-500 dark:text-ink-400 mt-0.5 font-medium">
        {label}
      </dt>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="bg-white dark:bg-ink-900 p-8">
      <p className="font-display text-5xl text-brand-200 dark:text-brand-900 mb-4 select-none">
        {n}
      </p>
      <h3 className="font-bold text-xl text-ink-900 dark:text-white mb-2">{title}</h3>
      <p className="text-ink-500 dark:text-ink-400 leading-relaxed text-sm md:text-base">{text}</p>
    </div>
  );
}
