"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";
import { SPECIALIZATIONS } from "@/lib/data/categories";

export default function RegisterForm({ role }: { role: Role }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [specs, setSpecs] = useState<string[]>([]);
  const [consented, setConsented] = useState(false);

  function toggleSpec(key: string) {
    setSpecs((curr) =>
      curr.includes(key) ? curr.filter((x) => x !== key) : [...curr, key],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consented) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
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
    <form className="card space-y-4" onSubmit={onSubmit}>
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
          <label className="label">Пароль (не короче 8 символов)</label>
          <input className="input" name="password" type="password" required minLength={8} />
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
                      : "bg-white border-ink-200 text-ink-700 hover:border-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-500 mt-2">
              Можно выбрать несколько. Профиль будет проверен модератором перед публикацией.
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
          required
        />
        <span className="text-sm text-ink-700">
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
      <p className="text-xs text-ink-500">
        На указанную почту будет отправлено письмо для подтверждения аккаунта.
      </p>
    </form>
  );
}
