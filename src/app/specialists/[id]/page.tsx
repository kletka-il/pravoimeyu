"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPECIALIZATIONS } from "@/lib/data/categories";

type Specialist = {
  id: string;
  bio: string;
  city: string;
  phone: string;
  yearsExperience: number;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  specializations: string[];
  credentials: string[];
  user: { name: string };
};

function parseSpecs(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return []; } }
  return [];
}

export default function SpecialistProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [spec, setSpec] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [question, setQuestion] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/specialists/${params.id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => setSpec(data.specialist))
      .catch(e => { if (e === 404) setNotFound(true); })
      .finally(() => setLoading(false));

    fetch("/api/auth/profile")
      .then(r => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, [params.id]);

  async function onBook(e: React.FormEvent) {
    e.preventDefault();
    if (isAuth === false) { router.push(`/login?next=/specialists/${params.id}`); return; }
    setSending(true);
    setSendError(null);
    const fromChat = !!localStorage.getItem("chat_ref_ts");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ specialistId: params.id, question, contactPhone: phone, fromChat }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) { setSendError(data?.error ?? "Ошибка. Попробуйте позже."); return; }
    localStorage.removeItem("chat_ref_ts");
    setSent(true);
  }

  if (loading) return <div className="container-page py-20 text-center text-ink-400">Загрузка…</div>;
  if (notFound || !spec) return (
    <div className="container-page py-20 text-center">
      <p className="text-ink-600 mb-4">Юрист не найден.</p>
      <Link href="/specialists" className="btn-primary">Все юристы</Link>
    </div>
  );

  const specializations = parseSpecs(spec.specializations);
  const credentials = parseSpecs(spec.credentials);
  const initials = spec.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="container-page py-10 md:py-14">
      <Link href="/specialists" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-brand-700 mb-6 transition-colors">
        ← Все юристы
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Левая колонка — профиль */}
        <div className="lg:col-span-2 space-y-6">
          {/* Шапка */}
          <div className="card flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-xl shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="heading-serif text-2xl md:text-3xl text-ink-900 dark:text-white">{spec.user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-ink-500">
                {spec.city && <span>📍 {spec.city}</span>}
                {spec.yearsExperience > 0 && <span>Стаж {(() => { const n = spec.yearsExperience; const m = n % 10; const h = n % 100; if (h >= 11 && h <= 14) return `${n} лет`; if (m === 1) return `${n} год`; if (m >= 2 && m <= 4) return `${n} года`; return `${n} лет`; })()}</span>}
                {spec.rating > 0 && (
                  <span className="text-sun-600 font-semibold">
                    ★ {spec.rating.toFixed(1)}
                    {spec.reviewsCount > 0 && <span className="font-normal text-ink-400"> ({spec.reviewsCount} отзывов)</span>}
                  </span>
                )}
                {spec.pricePerHour > 0 && (
                  <span className="font-semibold text-ink-700 dark:text-ink-200">
                    {spec.pricePerHour.toLocaleString("ru-RU")} ₽/час
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Специализации */}
          {specializations.length > 0 && (
            <div className="card">
              <h2 className="heading-serif text-xl mb-3">Специализация</h2>
              <div className="flex flex-wrap gap-2">
                {specializations.map(k => (
                  <span key={k} className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 text-sm border border-brand-100 dark:border-brand-900">
                    {SPECIALIZATIONS[k] ?? k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* О себе */}
          {spec.bio && (
            <div className="card">
              <h2 className="heading-serif text-xl mb-3">О специалисте</h2>
              <p className="text-ink-700 dark:text-ink-300 leading-relaxed whitespace-pre-line">{spec.bio}</p>
            </div>
          )}

          {/* Документы/регалии */}
          {credentials.length > 0 && (
            <div className="card">
              <h2 className="heading-serif text-xl mb-3">Документы и регалии</h2>
              <ul className="space-y-1.5">
                {credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-300">
                    <span className="text-brand-500 mt-0.5 shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Правая колонка — форма обращения */}
        <div id="contact" className="space-y-4">
          <div className="card sticky top-24">
            {sent ? (
              <div className="text-center space-y-3 py-4">
                <div className="text-4xl">✅</div>
                <h3 className="heading-serif text-xl">Обращение отправлено</h3>
                <p className="text-sm text-ink-600">Юрист получит ваш вопрос и ответит в ближайшее время.</p>
                <Link href="/dashboard/client/bookings" className="btn-primary w-full block text-center">
                  Мои обращения
                </Link>
              </div>
            ) : (
              <>
                <h3 className="heading-serif text-xl mb-4">Задать вопрос</h3>
                {isAuth === false && (
                  <div className="mb-4 p-3 bg-sun-50 border border-sun-200 rounded-xl text-sm text-ink-700">
                    Чтобы связаться с юристом, нужно{" "}
                    <Link href={`/login?next=/specialists/${params.id}`} className="font-semibold text-brand-700 hover:underline">войти</Link>{" "}
                    или{" "}
                    <Link href="/register" className="font-semibold text-brand-700 hover:underline">зарегистрироваться</Link>.
                  </div>
                )}
                <form onSubmit={onBook} className="space-y-3">
                  <div>
                    <label className="label">Ваш вопрос *</label>
                    <textarea
                      className="input min-h-[120px]"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      required
                      minLength={10}
                      placeholder="Опишите вашу ситуацию подробнее…"
                    />
                  </div>
                  <div>
                    <label className="label">Телефон для связи</label>
                    <input
                      className="input"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  {sendError && <p className="text-sm text-accent">{sendError}</p>}
                  <button className="btn-primary w-full" disabled={sending || isAuth === null}>
                    {sending ? "Отправляем…" : "Отправить обращение"}
                  </button>
                  <p className="text-xs text-ink-400 text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
