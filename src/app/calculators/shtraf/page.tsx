import ShtrafCalc from "./ShtrafCalc";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Калькулятор штрафа ГИБДД со скидкой | Права имею",
  description: "Рассчитайте штраф ГИБДД со скидкой 50% — при оплате в первые 20 дней. Узнайте исключения.",
  alternates: { canonical: "https://pravaimei.ru/calculators/shtraf" },
};

export default function ShtrafPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-2">
        <nav className="text-sm text-ink-400 dark:text-ink-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Калькуляторы</Link>
          <span>/</span>
          <span className="text-ink-600 dark:text-ink-300">Штраф ГИБДД</span>
        </nav>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-cobalt-600 dark:text-cobalt-400 uppercase tracking-widest mb-2">Калькулятор</p>
        <h1 className="heading-sans text-3xl md:text-4xl text-ink-900 dark:text-white mb-2">Штраф ГИБДД со скидкой</h1>
        <p className="text-ink-500 dark:text-ink-400 text-base md:text-lg max-w-2xl">
          Большинство штрафов ГИБДД можно оплатить в два раза дешевле, если уложиться в 20 дней.
        </p>
      </div>

      <ShtrafCalc />

      <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Считаете штраф незаконным?{" "}
          <Link href="/search?q=обжаловать штраф ГИБДД" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Читайте как обжаловать →
          </Link>
        </p>
      </div>
    </div>
  );
}
