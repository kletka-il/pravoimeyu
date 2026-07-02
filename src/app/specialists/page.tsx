import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { SPECIALIZATIONS } from "@/lib/data/categories";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

function yearsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} лет`;
  if (mod10 === 1) return `${n} год`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} года`;
  return `${n} лет`;
}

export const metadata: Metadata = {
  title: "Юристы — Права имею",
  description: "Найдите юриста по специализации. Проверенные специалисты — трудовые споры, ДТП, семейное право, уголовные дела и другие отрасли.",
};

type Props = { searchParams: { spec?: string } };

function parseSpecs(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return []; } }
  return [];
}

export default async function SpecialistsPage({ searchParams }: Props) {
  const session = await getSession();
  const isAuthenticated = !!session.userId;
  const activeSpec = searchParams.spec ?? "";

  const rawAll = await prisma.specialistProfile.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      avatarUrl: true,
      city: true,
      yearsExperience: true,
      pricePerHour: true,
      rating: true,
      reviewsCount: true,
      bio: true,
      specializations: true,
      user: { select: { name: true } },
    },
    orderBy: [{ rating: "desc" }, { yearsExperience: "desc" }],
  });
  // Strip base64 data — avatars served via /api/avatar/[id]
  const all = rawAll.map(({ avatarUrl, ...s }) => ({ ...s, hasAvatar: !!avatarUrl }));

  const specialists = activeSpec
    ? all.filter(s => parseSpecs(s.specializations).includes(activeSpec))
    : all;

  const specCounts: Record<string, number> = {};
  for (const s of all) {
    for (const key of parseSpecs(s.specializations)) {
      specCounts[key] = (specCounts[key] ?? 0) + 1;
    }
  }

  return (
    <div className="container-page py-10 md:py-14">
      {/* Шапка */}
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
        Каталог
      </div>
      <h1 className="heading-sans text-3xl md:text-5xl mb-3 text-ink-900 dark:text-white">
        Юристы и адвокаты
      </h1>
      <p className="text-ink-500 mb-8 md:text-lg max-w-2xl">
        Зарегистрированные специалисты портала. Выберите нужную специализацию и свяжитесь напрямую.
      </p>

      {/* Фильтр по специализации */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/specialists"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !activeSpec
              ? "bg-brand-700 text-white border-brand-700"
              : "border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-700"
          }`}
        >
          Все ({all.length})
        </Link>
        {Object.entries(SPECIALIZATIONS).map(([key, label]) => {
          const count = specCounts[key] ?? 0;
          if (count === 0) return null;
          return (
            <Link
              key={key}
              href={`/specialists?spec=${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeSpec === key
                  ? "bg-brand-700 text-white border-brand-700"
                  : "border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-700"
              }`}
            >
              {label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Список юристов */}
      {specialists.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-ink-600 mb-2">По этой специализации юристов пока нет.</p>
          <Link href="/specialists" className="text-brand-600 hover:underline text-sm">
            Показать всех
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialists.map(s => {
            const specs = parseSpecs(s.specializations);
            return (
              <SpecialistCard
                key={s.id}
                id={s.id}
                name={s.user.name}
                city={s.city}
                yearsExperience={s.yearsExperience}
                pricePerHour={s.pricePerHour}
                rating={s.rating}
                reviewsCount={s.reviewsCount}
                bio={s.bio}
                specializations={specs}
                isAuthenticated={isAuthenticated}
                hasAvatar={s.hasAvatar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SpecialistCard({
  id, name, city, yearsExperience, pricePerHour, rating, reviewsCount, bio, specializations, isAuthenticated, hasAvatar,
}: {
  id: string; name: string; city: string; yearsExperience: number;
  pricePerHour: number; rating: number; reviewsCount: number;
  bio: string; specializations: string[]; isAuthenticated: boolean; hasAvatar?: boolean;
}) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const specLabels = specializations.slice(0, 2).map(k => SPECIALIZATIONS[k] ?? k);

  return (
    <div className="card-hover flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        {/* Аватар */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm shrink-0">
          {hasAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/avatar/${id}`} alt={name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink-900 dark:text-white truncate">{name}</div>
          {city && (
            <div className="text-xs text-ink-400 mt-0.5">📍 {city}</div>
          )}
        </div>
      </div>

      {/* Специализации */}
      {specLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {specLabels.map(l => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-900">
              {l}
            </span>
          ))}
          {specializations.length > 2 && (
            <span className="text-xs text-ink-400">+{specializations.length - 2}</span>
          )}
        </div>
      )}

      {/* Bio */}
      {bio && (
        <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed mb-3 line-clamp-2 flex-1">
          {bio}
        </p>
      )}

      {/* Метрики */}
      <div className="flex items-center gap-3 text-sm mb-4 flex-wrap">
        {yearsExperience > 0 && (
          <span className="text-ink-500">Стаж: <b className="text-ink-800 dark:text-ink-200">{yearsLabel(yearsExperience)}</b></span>
        )}
        {rating > 0 && (
          <span className="text-sun-600 font-semibold">★ {rating.toFixed(1)}
            {reviewsCount > 0 && <span className="font-normal text-ink-400"> ({reviewsCount})</span>}
          </span>
        )}
        {pricePerHour > 0 && (
          <span className="text-ink-500">
            <b className="text-ink-800 dark:text-ink-200">{pricePerHour.toLocaleString("ru-RU")} ₽</b>/час
          </span>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-2 mt-auto">
        <Link href={`/specialists/${id}`} className="btn-outline flex-1 text-sm py-2 text-center">
          Профиль
        </Link>
        <Link
          href={isAuthenticated ? `/specialists/${id}#contact` : `/login?next=/specialists/${id}`}
          className="btn-primary flex-1 text-sm py-2 text-center"
        >
          Связаться
        </Link>
      </div>
    </div>
  );
}
