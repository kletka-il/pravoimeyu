import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryIcon, { CATEGORY_COLOR } from "@/components/CategoryIcon";
import { prisma } from "@/lib/prisma";
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
  "Задержали в полиции",
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
        {/* Базовый градиент */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 100% -10%, rgba(124,58,237,0.10), transparent)," +
              "radial-gradient(ellipse 500px 400px at -5% 110%, rgba(220,38,38,0.06), transparent)",
          }}
        />
        {/* Декоративный blob справа-вверху */}
        <div
          className="absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full -z-10 opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Декоративный blob снизу-по-центру */}
        <div
          className="absolute left-[60%] bottom-0 w-[300px] h-[300px] rounded-full -z-10 opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container-page pt-14 md:pt-24 pb-14 md:pb-20">
          <div className="max-w-3xl">
            {/* Декор-черта слева от подзаголовка */}
            <p className="font-display text-brand-600 dark:text-brand-400 text-xl md:text-2xl mb-3 tracking-wide flex items-center gap-3">
              <span className="w-8 h-[2px] rounded-full bg-brand-400 dark:bg-brand-600" aria-hidden="true" />
              Права имею
            </p>
            <h1 className="heading-sans text-4xl md:text-6xl lg:text-7xl mb-6 text-ink-900 dark:text-white">
              Что вам делать —{" "}
              {/* Градиентное подчёркивание на ключевом слове */}
              <span className="relative inline-block text-brand-600 dark:text-brand-400">
                мы знаем
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-400 to-brand-600 opacity-60"
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p className="text-ink-500 dark:text-ink-400 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Опишите ситуацию своими словами. Найдём готовый ответ из правовой
              базы, а если случай сложный — подберём юриста.
            </p>
            {/* Ореол-блик под поисковой строкой */}
            <div className="relative max-w-2xl">
              <div
                className="absolute -inset-2 rounded-3xl bg-brand-600/10 blur-xl -z-10"
                aria-hidden="true"
              />
              <SearchBar />
            </div>
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
      <section className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-950">
        <div className="container-page py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatItem value={articlesCount}     label="готовых ответов"     color="brand" />
            <StatItem value={categories.length} label="категорий права"     color="cobalt" />
            <StatItem value={specialistsCount}  label="проверенных юристов" color="accent" />
            <StatItem value="24 / 7"            label="доступ онлайн"       color="ink" />
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
          {categories.map((c) => {
            const col = CATEGORY_COLOR[c.slug] ?? { icon: "text-brand-600", bg: "bg-brand-50", darkBg: "dark:bg-brand-950" };
            return (
            <Link
              key={c.id}
              href={`/knowledge?category=${c.slug}`}
              className="group flex items-start gap-4 p-5 rounded-2xl card-premium border border-ink-100/80 dark:border-ink-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lift transition-all duration-200"
            >
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${col.bg} ${col.darkBg} flex items-center justify-center ${col.icon} shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_6px_rgba(15,15,26,0.08)] transition-transform group-hover:scale-110`}>
                <CategoryIcon slug={c.slug} size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug">
                  {c.title}
                </p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">{c.description}</p>
              </div>
            </Link>
          );})}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/situations" className="btn-outline w-full justify-center">
            Все ситуации →
          </Link>
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section className="relative overflow-hidden border-t border-b border-ink-100 dark:border-ink-800 bg-gradient-to-br from-ink-50 to-white dark:from-ink-950 dark:to-ink-900">
        {/* Центральный декоративный блик */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] opacity-[0.04] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="container-page py-16 md:py-20 relative">
          <div className="mb-12">
            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
              Три шага
            </p>
            <h2 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white">
              Как это работает
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 relative">
            {/* Пунктирная соединительная линия между шагами */}
            <div
              className="hidden md:block absolute top-11 left-[calc(33.33%+2.5rem)] right-[calc(33.33%+2.5rem)] h-px border-t-2 border-dashed border-brand-200 dark:border-brand-900 pointer-events-none"
              aria-hidden="true"
            />
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
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 md:p-12 text-white texture-noise">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 500px 300px at 110% 0%, rgba(220,38,38,0.8), transparent)",
            }}
          />
          {/* Декоративный фоновый текст */}
          <div
            className="absolute -right-4 -bottom-8 font-display text-[130px] leading-none text-white/[0.04] select-none pointer-events-none"
            aria-hidden="true"
          >
            Юрист
          </div>
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
              className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3.5 rounded-xl font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Стать юристом →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const statColors: Record<string, string> = {
  brand:  "text-brand-600 dark:text-brand-400",
  cobalt: "text-cobalt-600 dark:text-cobalt-400",
  accent: "text-accent-600 dark:text-accent-400",
  ink:    "text-ink-700 dark:text-ink-300",
};

const statBg: Record<string, string> = {
  brand:  "bg-brand-50 dark:bg-brand-950/60 border-brand-100 dark:border-brand-900",
  cobalt: "bg-cobalt-50 dark:bg-cobalt-950/60 border-cobalt-100 dark:border-cobalt-900",
  accent: "bg-accent-50 dark:bg-accent-950/40 border-accent-100 dark:border-accent-900",
  ink:    "bg-white dark:bg-ink-900 border-ink-100 dark:border-ink-800",
};

function StatItem({ value, label, color = "brand" }: { value: number | string; label: string; color?: string }) {
  return (
    <div className={`card-premium rounded-2xl p-5 border ${statBg[color]} relative overflow-hidden`}>
      {/* Угловой блик */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <dd className={`text-2xl md:text-3xl font-extrabold tracking-tight ${statColors[color]}`}>
        {typeof value === "number" ? value.toLocaleString("ru-RU") : value}
      </dd>
      <dt className="text-xs md:text-sm text-ink-500 dark:text-ink-400 mt-0.5 font-medium">
        {label}
      </dt>
    </div>
  );
}

const stepStyle: Record<string, { ring: string; dot: string; text: string }> = {
  "01": { ring: "border-brand-200 dark:border-brand-800",  dot: "bg-brand-500",  text: "text-brand-600 dark:text-brand-400" },
  "02": { ring: "border-cobalt-200 dark:border-cobalt-800", dot: "bg-cobalt-500", text: "text-cobalt-600 dark:text-cobalt-400" },
  "03": { ring: "border-accent-200 dark:border-accent-800", dot: "bg-accent-500", text: "text-accent-600 dark:text-accent-400" },
};

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  const s = stepStyle[n] ?? stepStyle["01"];
  return (
    <div className="card-premium rounded-2xl p-8 border border-ink-100 dark:border-ink-700">
      {/* Медальон с номером */}
      <div className={`relative mb-6 w-14 h-14 rounded-2xl border-2 ${s.ring} flex items-center justify-center`}>
        <span className={`font-display text-2xl font-bold select-none ${s.text}`}>{n}</span>
        <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full ${s.dot} shadow-md`} aria-hidden="true" />
      </div>
      <h3 className="font-bold text-xl text-ink-900 dark:text-white mb-2">{title}</h3>
      <p className="text-ink-500 dark:text-ink-400 leading-relaxed text-sm md:text-base">{text}</p>
    </div>
  );
}
