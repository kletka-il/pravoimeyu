import ZarplataCalc from "./ZarplataCalc";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор компенсации за задержку зарплаты | Права имею",
  description: "Рассчитайте компенсацию за задержку выплаты зарплаты по ст. 236 ТК РФ — 1/150 ключевой ставки за каждый день.",
  alternates: { canonical: "https://pravaimeu.ru/calculators/zarplata" },
};

export default function ZarplataPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-2">
        <nav className="text-sm text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Калькуляторы</Link>
          <span>/</span>
          <span className="text-ink-600 dark:text-ink-300">Задержка зарплаты</span>
        </nav>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">Калькулятор</p>
        <h1 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white mb-2">Задержка зарплаты</h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg max-w-2xl">
          Работодатель задержал выплату? Рассчитайте обязательную компенсацию, которую он должен выплатить сверх долга.
        </p>
      </div>

      <ZarplataCalc />

      <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Не платят зарплату?{" "}
          <Link href="/knowledge?category=trudovye-spory" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Статьи по трудовым спорам →
          </Link>
        </p>
      </div>
    </div>
  );
}
