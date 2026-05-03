import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Право имею — юридическая помощь, когда она нужна срочно",
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  alternates: { canonical: "https://pravaimei.ru" },
  openGraph: {
    title: "Право имею — юридическая помощь, когда она нужна срочно",
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
  "Задержали в полиции",
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Право имею",
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
  name: "Право имею",
  url: "https://pravaimei.ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pravaimei.ru/search?q={search_term_string}",
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
      <section className="bg-gradient-to-b from-ink-900 via-ink-900 to-ink-800 text-white">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="text-gold uppercase tracking-widest text-xs font-semibold mb-4">
              Юридическая помощь, когда она нужна срочно
            </div>
            <h1 className="heading-serif text-white text-4xl md:text-6xl mb-6">
              Что вам делать в этой ситуации — мы знаем
            </h1>
            <p className="text-ink-100 text-lg md:text-xl mb-8 max-w-2xl">
              Опишите ситуацию своими словами. Мы найдём готовый ответ из правовой
              базы, а если случай сложный — подберём специалиста с подходящим
              опытом.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2 mt-5">
              {POPULAR_QUERIES.map((q) => (
                <Link
                  key={q}
                  href={`/search?q=${encodeURIComponent(q)}`}
                  className="text-sm bg-white/10 hover:bg-white/20 text-ink-100 px-3 py-1.5 rounded-full transition"
                >
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <Stat number={articlesCount} label="Готовых ответов" />
        <Stat number={categories.length} label="Категорий ситуаций" />
        <Stat number={specialistsCount} label="Проверенных юристов" />
        <Stat number="24/7" label="Доступ онлайн" />
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="heading-serif text-3xl md:text-4xl">Жизненные ситуации</h2>
            <p className="text-ink-500 mt-2">
              Выберите свою категорию — внутри готовые ответы и юристы
              соответствующей специализации.
            </p>
          </div>
          <Link href="/situations" className="hidden md:inline btn-outline">
            Все ситуации →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/knowledge?category=${c.slug}`}
              className="card hover:border-accent hover:shadow-soft transition group"
            >
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="heading-serif text-xl group-hover:text-accent transition">
                {c.title}
              </div>
              <p className="text-sm text-ink-500 mt-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-ink-100">
        <div className="container-page py-16">
          <h2 className="heading-serif text-3xl md:text-4xl text-center mb-12">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              n="1"
              title="Опишите свою ситуацию"
              text="В строке поиска — обычным языком. «Попал в аварию, виноват не я», «Не платят зарплату», «Закрыли въезд в Россию»."
            />
            <Step
              n="2"
              title="Получите готовые ответы"
              text="Умный поиск находит юридические подсказки в базе из десятков тщательно подготовленных статей со ссылками на нормы закона."
            />
            <Step
              n="3"
              title="Выберите юриста — если нужно"
              text="Если вопрос сложный или требует представительства — мы подберём специалиста с нужным опытом и стажем по вашему делу."
            />
          </div>
        </div>
      </section>

      {/* CTA для юристов */}
      <section className="container-page py-16">
        <div className="card flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="heading-serif text-2xl">Вы юрист?</h3>
            <p className="text-ink-500 mt-1">
              Подключайтесь к платформе. Получайте обращения по своей
              специализации, ведите кабинет, набирайте отзывы.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/register?role=SPECIALIST" className="btn-primary">
              Стать юристом «Право имею»
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: number | string; label: string }) {
  return (
    <div className="bg-white shadow-card border border-ink-100 rounded-lg p-5">
      <div className="heading-serif text-3xl md:text-4xl text-accent">
        {number}
      </div>
      <div className="text-sm text-ink-500 mt-1">{label}</div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div>
      <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-serif text-xl mb-4">
        {n}
      </div>
      <h3 className="heading-serif text-xl mb-2">{title}</h3>
      <p className="text-ink-600">{text}</p>
    </div>
  );
}
