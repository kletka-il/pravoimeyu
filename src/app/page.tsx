import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Права имей — юридическая помощь, когда она нужна срочно",
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  alternates: { canonical: "https://pravaimeu.ru" },
  openGraph: {
    title: "Права имей — юридическая помощь, когда она нужна срочно",
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
  name: "Права имей",
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
  name: "Права имей",
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 800px 400px at 80% 0%, rgba(31, 76, 245, 0.12), transparent), radial-gradient(ellipse 600px 400px at 0% 100%, rgba(255, 107, 61, 0.08), transparent)",
          }}
        />
        <div className="container-page pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span className="inline-block w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              Юридическая помощь онлайн — 24/7
            </div>
            <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mb-6">
              Что вам делать —{" "}
              <span className="text-brand-600">мы знаем</span>
            </h1>
            <p className="text-ink-600 text-lg md:text-xl mb-8 max-w-2xl">
              Опишите ситуацию своими словами. Найдём готовый ответ из правовой
              базы, а если случай сложный — подберём юриста с нужным опытом.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="text-sm text-ink-500 mr-2 self-center">Часто ищут:</span>
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
        </div>
      </section>

      {/* Stats */}
      <section className="container-page grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20">
        <Stat number={articlesCount} label="Готовых ответов" emoji="📋" tint="brand" />
        <Stat number={categories.length} label="Категорий ситуаций" emoji="🧭" tint="sky" />
        <Stat number={specialistsCount} label="Проверенных юристов" emoji="⚖️" tint="mint" />
        <Stat number="24/7" label="Доступ онлайн" emoji="⚡" tint="accent" />
      </section>

      {/* Categories */}
      <section className="container-page pb-16 md:pb-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="heading-display text-3xl md:text-4xl">Жизненные ситуации</h2>
            <p className="text-ink-500 mt-2 text-base md:text-lg">
              Выберите категорию — внутри готовые ответы и юристы.
            </p>
          </div>
          <Link href="/situations" className="hidden md:inline-flex btn-outline">
            Все ситуации →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/knowledge?category=${c.slug}`}
              className="card-hover group flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 group-hover:scale-110 transition-all">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg text-ink-900 group-hover:text-brand-700 transition-colors">
                  {c.title}
                </div>
                <p className="text-sm text-ink-500 mt-1">{c.description}</p>
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

      {/* How it works */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-sky-50 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900 border-y border-ink-100 dark:border-ink-800">
        <div className="container-page py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block bg-white text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              За 3 шага
            </div>
            <h2 className="heading-display text-3xl md:text-4xl">
              Как это работает
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Step
              n="1"
              emoji="✍️"
              title="Опишите ситуацию"
              text="Обычным языком, как другу. «Попал в ДТП, не виноват», «Не платят зарплату», «Закрыли въезд»."
            />
            <Step
              n="2"
              emoji="⚡"
              title="Получите ответ"
              text="Умный поиск выдаст подсказку из базы — со ссылками на статьи закона. Бесплатно."
            />
            <Step
              n="3"
              emoji="🤝"
              title="Выберите юриста"
              text="Если вопрос сложный — подберём специалиста с нужным опытом. Только проверенные."
            />
          </div>
        </div>
      </section>

      {/* CTA для юристов */}
      <section className="container-page py-16 md:py-20">
        <div className="relative overflow-hidden bg-ink-900 rounded-3xl p-8 md:p-12 text-white">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 600px 300px at 100% 0%, rgba(31, 76, 245, 0.6), transparent), radial-gradient(ellipse 400px 200px at 0% 100%, rgba(255, 107, 61, 0.4), transparent)",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Юристам
              </div>
              <h3 className="heading-display text-2xl md:text-3xl text-white mb-2">
                Подключитесь к платформе
              </h3>
              <p className="text-white/70 text-base md:text-lg max-w-xl">
                Получайте обращения по своей специализации, ведите кабинет,
                набирайте отзывы.
              </p>
            </div>
            <Link
              href="/register?role=SPECIALIST"
              className="bg-white text-ink-900 hover:bg-brand-50 hover:text-brand-700 px-6 py-3.5 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Стать юристом →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const tintClasses: Record<string, string> = {
  brand: "bg-brand-50 border-brand-100",
  sky: "bg-sky-50 border-sky-100",
  mint: "bg-mint-50 border-mint-100",
  accent: "bg-accent-50 border-accent-100",
};

function Stat({
  number,
  label,
  emoji,
  tint,
}: {
  number: number | string;
  label: string;
  emoji: string;
  tint: keyof typeof tintClasses;
}) {
  return (
    <div className={`rounded-2xl border ${tintClasses[tint]} p-4 md:p-5`}>
      <div className="text-2xl mb-1.5">{emoji}</div>
      <div className="font-extrabold text-2xl md:text-3xl text-ink-900 tracking-tight">
        {number}
      </div>
      <div className="text-xs md:text-sm text-ink-500 mt-0.5 font-medium">{label}</div>
    </div>
  );
}

function Step({
  n,
  emoji,
  title,
  text,
}: {
  n: string;
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-card border border-ink-100 dark:border-ink-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
          {n}
        </div>
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="font-bold text-xl mb-2 text-ink-900">{title}</h3>
      <p className="text-ink-600 leading-relaxed">{text}</p>
    </div>
  );
}
