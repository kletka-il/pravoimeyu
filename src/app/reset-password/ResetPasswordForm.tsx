"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Ошибка. Попробуйте запросить ссылку заново.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (!token) {
    return (
      <div className="card space-y-4">
        <p className="text-accent">Неверная или устаревшая ссылка.</p>
        <Link href="/forgot-password" className="btn-primary w-full text-center block">
          Запросить новую ссылку
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card space-y-4">
        <p className="text-ink-700">
          Пароль успешно изменён. Сейчас перенаправим вас на страницу входа…
        </p>
        <Link href="/login" className="btn-primary w-full text-center block">
          Войти
        </Link>
      </div>
    );
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Новый пароль</label>
        <div className="relative">
          <input
            className="input pr-11"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="от 8 символов"
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
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Сохраняем…" : "Сохранить новый пароль"}
      </button>
      <p className="text-xs text-ink-500">
        <Link href="/forgot-password" className="text-accent hover:underline">
          Запросить ссылку заново
        </Link>
      </p>
    </form>
  );
}
