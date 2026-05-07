import AlimonyCalc from "./AlimonyCalc";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор алиментов | Права имею",
  description: "Рассчитайте размер алиментов онлайн — по доходу на 1, 2 или 3 детей. Формула по ст. 81 СК РФ.",
  alternates: { canonical: "https://pravaimeu.ru/calculators/alimenty" },
};

export default function AlimonyPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-2">
        <nav className="text-sm text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Калькуляторы</Link>
          <span>/</span>
          <span className="text-ink-600 dark:text-ink-300">Алименты</span>
        </nav>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">Калькулятор</p>
        <h1 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white mb-2">Алименты</h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg max-w-2xl">
          Укажите чистый доход плательщика и количество детей — калькулятор рассчитает ежемесячную сумму по закону.
        </p>
      </div>

      <AlimonyCalc />

      <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Нужна помощь юриста?{" "}
          <Link href="/knowledge?category=semya-i-deti" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Читайте статьи по семейному праву →
          </Link>
        </p>
      </div>
    </div>
  );
}
