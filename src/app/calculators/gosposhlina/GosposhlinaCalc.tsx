"use client";
import { useState } from "react";

function calcFee(claim: number): number {
  if (claim <= 0) return 0;
  if (claim <= 20_000) return Math.max(400, claim * 0.04);
  if (claim <= 100_000) return 800 + (claim - 20_000) * 0.03;
  if (claim <= 200_000) return 3_200 + (claim - 100_000) * 0.02;
  if (claim <= 1_000_000) return 5_200 + (claim - 200_000) * 0.01;
  return Math.min(60_000, 13_200 + (claim - 1_000_000) * 0.005);
}

function feeBreakdown(claim: number): string {
  if (claim <= 0) return "";
  if (claim <= 20_000) return `4% от суммы иска, мин. 400 ₽`;
  if (claim <= 100_000) return `800 ₽ + 3% от суммы свыше 20 000 ₽`;
  if (claim <= 200_000) return `3 200 ₽ + 2% от суммы свыше 100 000 ₽`;
  if (claim <= 1_000_000) return `5 200 ₽ + 1% от суммы свыше 200 000 ₽`;
  return `13 200 ₽ + 0,5% от суммы свыше 1 000 000 ₽, макс. 60 000 ₽`;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

export default function GosposhlinaCalc() {
  const [claim, setClaim] = useState("");

  const claimNum = parseFloat(claim.replace(/\s/g, "").replace(",", ".")) || 0;
  const fee = calcFee(claimNum);
  const hasResult = claimNum > 0;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-1.5">
            Сумма иска, ₽
          </label>
          <input
            type="number"
            min="0"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            placeholder="100 000"
          />
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-1.5">Сумма ущерба или требований к ответчику</p>
        </div>

        {hasResult && (
          <div className="rounded-xl bg-ink-50 dark:bg-ink-800 p-4">
            <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-1">Применяемая ставка</p>
            <p className="text-sm text-ink-700 dark:text-ink-300">{feeBreakdown(claimNum)}</p>
          </div>
        )}

        <div className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
          <p className="font-semibold text-ink-700 dark:text-ink-300 text-xs uppercase tracking-wide">Пороговые значения</p>
          {[
            ["до 20 000 ₽", "4%, мин. 400 ₽"],
            ["20 001 – 100 000 ₽", "800 ₽ + 3%"],
            ["100 001 – 200 000 ₽", "3 200 ₽ + 2%"],
            ["200 001 – 1 000 000 ₽", "5 200 ₽ + 1%"],
            ["свыше 1 000 000 ₽", "13 200 ₽ + 0,5%, макс. 60 000 ₽"],
          ].map(([range, rate]) => (
            <div key={range} className="flex justify-between">
              <span>{range}</span>
              <span className="font-medium text-ink-700 dark:text-ink-300">{rate}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-6 transition ${hasResult ? "border-cobalt-200 dark:border-cobalt-800 bg-cobalt-50 dark:bg-cobalt-950" : "border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-900"}`}>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">Госпошлина</p>
          <p className={`text-4xl font-extrabold tracking-tight ${hasResult ? "text-cobalt-700 dark:text-cobalt-300" : "text-ink-300 dark:text-ink-600"}`}>
            {hasResult ? fmt(fee) : "—"}
          </p>
          {hasResult && (
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
              {((fee / claimNum) * 100).toFixed(2)}% от суммы иска
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">Правовая основа</p>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            <span className="font-semibold">Ст. 333.19 НК РФ</span> — размеры госпошлин по делам, рассматриваемым в судах общей юрисдикции.
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-2 leading-relaxed">
            Льготники (инвалиды I–II гр., ветераны) освобождены от пошлины при иске до 1 000 000 ₽.
          </p>
        </div>
      </div>
    </div>
  );
}
