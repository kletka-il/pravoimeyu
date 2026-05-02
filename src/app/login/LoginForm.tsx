"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Ошибка входа");
      return;
    }
    const target = next || data.dashboard || "/dashboard";
    router.push(target);
    router.refresh();
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" required autoFocus />
      </div>
      <div>
        <label className="label">Пароль</label>
        <input className="input" name="password" type="password" required />
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Входим…" : "Войти"}
      </button>
      <p className="text-xs text-ink-400">
        Тестовые учётки см. в README. Пароль для всех: <code>Password123!</code>
      </p>
    </form>
  );
}
