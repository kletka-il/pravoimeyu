import Link from "next/link";
import { Users, Scale, ShoppingBag, Briefcase, Car } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Юридические калькуляторы | Права имею",
  description: "Бесплатные онлайн-калькуляторы: алименты, госпошлина в суд, неустойка по ЗПП, компенсация за задержку зарплаты, штраф ГИБДД.",
  alternates: { canonical: "https://pravaimeu.ru/calculators" },
  openGraph: {
    title: "Юридические калькуляторы · Права имею",
    description: "Алименты, госпошлина, неустойка, задержка зарплаты, штраф ГИБДД — рассчитайте онлайн бесплатно.",
    url: "https://pravaimeu.ru/calculators",
    type: "website",
  },
};

const CALCS = [
  {
    href: "/calculators/alimenty",
    Icon: Users,
    color: { icon: "text-brand-600", bg: "bg-brand-50", darkBg: "dark:bg-brand-950", border: "hover:border-brand-300 dark:hover:border-brand-700" },
    title: "Алименты",
    desc: "Размер выплат по доходу: 1, 2 или 3+ детей",
    law: "ст. 81 СК РФ",
    tag: "Семейное право",
  },
  {
    href: "/calculators/gosposhlina",
    Icon: Scale,
    color: { icon: "text-cobalt-600", bg: "bg-cobalt-50", darkBg: "dark:bg-cobalt-950", border: "hover:border-cobalt-300 dark:hover:border-cobalt-700" },
    title: "Госпошлина в суд",
    desc: "Точная сумма пошлины по размеру иска",
    law: "ст. 333.19 НК РФ",
    tag: "Судебные расходы",
  },
  {
    href: "/calculators/neustojka",
    Icon: ShoppingBag,
    color: { icon: "text-accent-600", bg: "bg-accent-50", darkBg: "dark:bg-accent-950/40", border: "hover:border-accent-300 dark:hover:border-accent-700" },
    title: "Неустойка по ЗПП",
    desc: "1% за товар или 3% за услугу за каждый день",
    law: "ст. 21, 28 ЗПП",
    tag: "Права потребителей",
  },
  {
    href: "/calculators/zarplata",
    Icon: Briefcase,
    color: { icon: "text-brand-600", bg: "bg-brand-50", darkBg: "dark:bg-brand-950", border: "hover:border-brand-300 dark:hover:border-brand-700" },
    title: "Задержка зарплаты",
    desc: "Компенсация работодателя за каждый день просрочки",
    law: "ст. 236 ТК РФ",
    tag: "Трудовые споры",
  },
  {
    href: "/calculators/shtraf",
    Icon: Car,
    color: { icon: "text-cobalt-600", bg: "bg-cobalt-50", darkBg: "dark:bg-cobalt-950", border: "hover:border-cobalt-300 dark:hover:border-cobalt-700" },
    title: "Штраф ГИБДД",
    desc: "Сумма со скидкой 50% при оплате в 20 дней",
    law: "ч. 1.3 ст. 32.2 КоАП",
    tag: "ДТП и ГИБДД",
  },
];

export default function CalculatorsPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-2xl mb-10">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
          Инструменты
        </p>
        <h1 className="heading-sans text-4xl md:text-5xl mb-3 text-ink-900 dark:text-white">
          Юридические калькуляторы
        </h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg leading-relaxed">
          Рассчитайте суммы по вашей ситуации — алименты, пошлины, штрафы, компенсации. Бесплатно, без регистрации.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CALCS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group flex flex-col gap-4 p-6 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 ${c.color.border} hover:shadow-lift transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${c.color.bg} ${c.color.darkBg} flex items-center justify-center ${c.color.icon}`}>
                <c.Icon size={20} strokeWidth={1.5} />
              </div>
              <span className="badge bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 text-xs">
                {c.law}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug">
                {c.title}
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 leading-snug">{c.desc}</p>
            </div>
            <div className="mt-auto pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
              <span className="text-xs text-ink-400 dark:text-ink-500">{c.tag}</span>
              <span className={`text-sm font-semibold ${c.color.icon} group-hover:translate-x-0.5 transition-transform`}>
                Рассчитать →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900/50 p-6 md:p-8">
        <p className="text-sm font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider mb-2">Важно</p>
        <p className="text-ink-600 dark:text-ink-400 text-sm md:text-base leading-relaxed max-w-3xl">
          Калькуляторы дают ориентировочные суммы на основании действующего законодательства.
          Итоговый размер выплат может отличаться — суд учитывает индивидуальные обстоятельства дела.
          При сложных ситуациях рекомендуем консультацию юриста.
        </p>
        <Link href="/situations" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
          Найти юриста по вашей ситуации →
        </Link>
      </div>
    </div>
  );
}
