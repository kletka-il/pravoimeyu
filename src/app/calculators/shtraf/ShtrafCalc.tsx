"use client";
import { useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const EXCLUSIONS = [
  "Управление в нетрезвом виде (ст. 12.8 КоАП)",
  "Повторное нарушение при лишении прав",
  "Превышение скорости более чем на 60 км/ч повторно",
  "Выезд на встречную полосу повторно",
  "ДТП с пострадавшими",
];

export default function ShtrafCalc() {
  const [fine, setFine] = useState("");

  const fineNum = parseFloat(fine.replace(/\s/g, "").replace(",", ".")) || 0;
  const discounted = fineNum * 0.5;
  const saving = fineNum - discounted;
  const hasResult = fineNum > 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
            Сумма штрафа, ₽
          </label>
          <input
            type="number"
            min="0"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition"
            placeholder="1 500"
          />
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-1.5">Указана в постановлении ГИБДД или пришла с камеры</p>
        </div>

        <div className="rounded-xl bg-ink-50 dark:bg-ink-800 p-4 space-y-2">
          <p className="text-xs font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wide">Скидка 50% не действует при:</p>
          <ul className="space-y-1.5">
            {EXCLUSIONS.map((ex) => (
              <li key={ex} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-400">
                <span className="text-accent-500 mt-0.5 flex-shrink-0">✕</span>
                {ex}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-6 transition ${hasResult ? "border-cobalt-200 dark:border-cobalt-800 bg-cobalt-50 dark:bg-cobalt-950" : "border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900"}`}>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-3">Оплатить со скидкой 50%</p>
          <p className={`text-4xl font-extrabold tracking-tight ${hasResult ? "text-cobalt-700 dark:text-cobalt-300" : "text-ink-300 dark:text-ink-600"}`}>
            {hasResult ? fmt(discounted) : "—"}
          </p>
          {hasResult && (
            <>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">вместо {fmt(fineNum)}</p>
              <div className="mt-3 pt-3 border-t border-cobalt-200 dark:border-cobalt-800">
                <p className="text-sm font-semibold text-cobalt-700 dark:text-cobalt-300">Вы экономите {fmt(saving)}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">при оплате в течение 20 дней с даты постановления</p>
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">Правовая основа</p>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            <span className="font-semibold">Ч. 1.3 ст. 32.2 КоАП РФ</span> — штраф за нарушение ПДД можно оплатить со скидкой 50% в течение 20 дней с момента вынесения постановления.
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2 leading-relaxed">
            Оплатить можно через Госуслуги, банк или сайт ГИБДД.
          </p>
        </div>
      </div>
    </div>
  );
}
