import GosposhlinaCalc from "./GosposhlinaCalc";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор госпошлины в суд | Права имею",
  description: "Рассчитайте размер государственной пошлины для подачи иска. Актуальные ставки по ст. 333.19 НК РФ.",
  alternates: { canonical: "https://pravaimei.ru/calculators/gosposhlina" },
};

export default function GosposhlinaPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-2">
        <nav className="text-sm text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Калькуляторы</Link>
          <span>/</span>
          <span className="text-ink-600 dark:text-ink-300">Госпошлина</span>
        </nav>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-cobalt-600 dark:text-cobalt-400 uppercase tracking-widest mb-2">Калькулятор</p>
        <h1 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white mb-2">Госпошлина в суд</h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg max-w-2xl">
          Введите сумму иска — калькулятор автоматически определит размер госпошлины по актуальным ставкам НК РФ.
        </p>
      </div>

      <GosposhlinaCalc />

      <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Готовитесь подать в суд?{" "}
          <Link href="/search?q=исковое заявление" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Читайте как составить иск →
          </Link>
        </p>
      </div>
    </div>
  );
}
