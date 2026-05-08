"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";
import { SPECIALIZATIONS } from "@/lib/data/categories";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function RegisterForm({ role }: { role: Role }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [specs, setSpecs] = useState<string[]>([]);
  const [customSpec, setCustomSpec] = useState("");
  const [consented, setConsented] = useState(false);

  function toggleSpec(key: string) {
    setSpecs((curr) =>
      curr.includes(key) ? curr.filter((x) => x !== key) : [...curr, key],
    );
  }

  function addCustomSpec() {
    const val = customSpec.trim();
    if (!val || specs.includes(val)) return;
    setSpecs((curr) => [...curr, val]);
    setCustomSpec("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consented) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password.length < 8) {
      setError("Пароль должен быть не короче 8 символов");
      return;
    }
    setLoading(true);
    setError(null);
    const body: Record<string, unknown> = Object.fromEntries(fd.entries());
    body.role = role;
    if (role === ROLE.SPECIALIST) body.specializations = specs;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Ошибка регистрации");
      return;
    }
    router.push("/login?registered=1");
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className="label">Имя {role === ROLE.SPECIALIST ? "и фамилия" : ""}</label>
        <input className="input" name="name" required minLength={2} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" required />
        </div>
        <div>
          <label className="label">Пароль (от 8 символов)</label>
          <div className="relative">
            <input
              className="input pr-11"
              name="password"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>
      </div>
      {role === ROLE.SPECIALIST && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Город</label>
              <input className="input" name="city" placeholder="Москва" />
            </div>
            <div>
              <label className="label">Стаж, лет</label>
              <input
                className="input"
                name="yearsExperience"
                type="number"
                min="0"
                max="70"
                defaultValue="0"
              />
            </div>
          </div>
          <div>
            <label className="label">Телефон</label>
            <input className="input" name="phone" placeholder="+7" />
          </div>
          <div>
            <label className="label">Специализации</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SPECIALIZATIONS).map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleSpec(key)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    specs.includes(key)
                      ? "bg-accent text-white border-accent"
                      : "bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:border-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {specs.filter((s) => !Object.keys(SPECIALIZATIONS).includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specs.filter((s) => !Object.keys(SPECIALIZATIONS).includes(s)).map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-brand-600 text-white border border-brand-600"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSpecs((curr) => curr.filter((x) => x !== s))}
                      className="hover:text-brand-200 transition-colors leading-none"
                      aria-label="Удалить"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <input
                className="input flex-1"
                placeholder="Своя специализация…"
                value={customSpec}
                onChange={(e) => setCustomSpec(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSpec(); } }}
              />
              <button
                type="button"
                onClick={addCustomSpec}
                className="btn-ghost text-sm px-4 py-2 shrink-0"
              >
                Добавить
              </button>
            </div>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-2">
              Можно выбрать несколько или написать свою. Профиль будет проверен модератором перед публикацией.
            </p>
          </div>
        </>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 accent-accent"
        />
        <span className="text-sm text-ink-700 dark:text-ink-300">
          Я согласен(-на) на обработку персональных данных в соответствии с{" "}
          <Link href="/privacy" target="_blank" className="text-accent underline hover:no-underline">
            политикой конфиденциальности
          </Link>
          . Понимаю, что просмотр сайта не создаёт отношений адвокат–клиент.
        </span>
      </label>

      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary w-full" disabled={loading || !consented}>
        {loading ? "Регистрируем…" : "Зарегистрироваться"}
      </button>
      <p className="text-xs text-ink-500 dark:text-ink-400">
        На указанную почту будет отправлено письмо для подтверждения аккаунта.
      </p>
    </form>
  );
}
