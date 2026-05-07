"use client";
import { useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const TYPES = [
  { id: "goods", label: "Товар", rate: 0.01, rateLabel: "1% в день", law: "ст. 21 ЗПП", desc: "Нарушение сроков замены/возврата товара" },
  { id: "service", label: "Услуга / работа", rate: 0.03, rateLabel: "3% в день", law: "ст. 28 ЗПП", desc: "Нарушение сроков выполнения работ или услуг" },
];

export default function NeustojkaCalc() {
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [typeIdx, setTypeIdx] = useState(0);

  const priceNum = parseFloat(price.replace(/\s/g, "").replace(",", ".")) || 0;
  const daysNum = parseInt(days) || 0;
  const type = TYPES[typeIdx];
  const rawPenalty = priceNum * type.rate * daysNum;
  const penalty = Math.min(rawPenalty, priceNum); // не может превышать цену
  const isCapped = rawPenalty > priceNum && priceNum > 0;
  const hasResult = priceNum > 0 && daysNum > 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2.5">
            Тип нарушения
          </label>
          <div className="flex gap-3">
            {TYPES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTypeIdx(i)}
                className={`flex-1 rounded-xl border px-3 py-3 text-sm font-medium transition text-left ${
                  typeIdx === i
                    ? "border-accent-500 bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300"
                    : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-accent-300"
                }`}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{t.rateLabel}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2">{type.desc} — {type.law}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
            Цена товара / стоимость услуги, ₽
          </label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition"
            placeholder="15 000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
            Количество дней просрочки
          </label>
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition"
            placeholder="30"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-6 transition ${hasResult ? "border-accent-200 dark:border-accent-800 bg-accent-50 dark:bg-accent-950/40" : "border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900"}`}>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">Неустойка</p>
          <p className={`text-4xl font-extrabold tracking-tight ${hasResult ? "text-accent-700 dark:text-accent-300" : "text-ink-300 dark:text-ink-600"}`}>
            {hasResult ? fmt(penalty) : "—"}
          </p>
          {hasResult && (
            <div className="mt-2 space-y-1">
              {isCapped && (
                <p className="text-xs font-semibold text-accent-600 dark:text-accent-400">
                  Ограничено ценой товара — по закону неустойка не может её превышать
                </p>
              )}
              {!isCapped && (
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  {fmt(priceNum)} × {type.rate * 100}% × {daysNum} дн.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">Правовая основа</p>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            <span className="font-semibold">Закон о защите прав потребителей</span> — ст. 21 (товар) и ст. 28 (услуга/работа). Неустойка не может превышать цену товара или стоимость работы.
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2 leading-relaxed">
            Помимо неустойки можно требовать компенсацию морального вреда и 50% штраф в пользу потребителя (ст. 13 ЗПП).
          </p>
        </div>
      </div>
    </div>
  );
}
