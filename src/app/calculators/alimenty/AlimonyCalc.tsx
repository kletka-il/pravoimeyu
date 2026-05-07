"use client";
import { useState } from "react";

const RATES = [0.25, 0.333, 0.5];
const RATE_LABELS = ["25% дохода", "33% дохода", "50% дохода"];

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

export default function AlimonyCalc() {
  const [income, setIncome] = useState("");
  const [children, setChildren] = useState(0);

  const incomeNum = parseFloat(income.replace(/\s/g, "").replace(",", ".")) || 0;
  const rate = RATES[children];
  const result = incomeNum * rate;
  const hasResult = incomeNum > 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
            Ежемесячный доход плательщика, ₽
          </label>
          <input
            type="number"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            placeholder="80 000"
          />
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-1.5">Чистый доход после вычета НДФЛ</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2.5">
            Количество детей
          </label>
          <div className="flex gap-3">
            {["1", "2", "3+"].map((label, i) => (
              <button
                key={i}
                onClick={() => setChildren(i)}
                className={`flex-1 rounded-xl border py-3 text-base font-semibold transition ${
                  children === i
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                    : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-brand-300 dark:hover:border-brand-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2">{RATE_LABELS[children]} от заработка</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-6 transition ${hasResult ? "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950" : "border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900"}`}>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">Ежемесячные алименты</p>
          <p className={`text-4xl font-extrabold tracking-tight ${hasResult ? "text-brand-700 dark:text-brand-300" : "text-ink-300 dark:text-ink-600"}`}>
            {hasResult ? fmt(result) : "—"}
          </p>
          {hasResult && (
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
              {RATE_LABELS[children]} от {fmt(incomeNum)}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">Правовая основа</p>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            <span className="font-semibold">Ст. 81 Семейного кодекса РФ</span> — суд взыскивает: на 1 ребёнка — ¼, на 2 — ⅓, на 3 и более — ½ заработка.
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2 leading-relaxed">
            Суд вправе изменить размер с учётом финансового положения сторон и иных обстоятельств.
          </p>
        </div>
      </div>
    </div>
  );
}
