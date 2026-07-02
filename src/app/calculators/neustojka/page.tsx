import NeustojkaCalc from "./NeustojkaCalc";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор неустойки по ЗПП | Права имею",
  description: "Рассчитайте неустойку за нарушение прав потребителя — 1% за товар или 3% за услугу. Закон о защите прав потребителей.",
  alternates: { canonical: "https://pravaimei.ru/calculators/neustojka" },
};

export default function NeustojkaPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-2">
        <nav className="text-sm text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Калькуляторы</Link>
          <span>/</span>
          <span className="text-ink-600 dark:text-ink-300">Неустойка ЗПП</span>
        </nav>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-widest mb-2">Калькулятор</p>
        <h1 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white mb-2">Неустойка по ЗПП</h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg max-w-2xl">
          Продавец затянул с возвратом денег или мастер не уложился в срок — рассчитайте штрафные санкции по закону.
        </p>
      </div>

      <NeustojkaCalc />

      <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Нарушены ваши права?{" "}
          <Link href="/knowledge?category=prava-potrebitelya" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Статьи по правам потребителей →
          </Link>
        </p>
      </div>
    </div>
  );
}
