"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Защита от open redirect: разрешаем только относительные пути,
// исключая protocol-relative ("//evil.com") и URL со схемой.
function safeRedirect(value: string | undefined | null): string | null {
  if (!value || typeof value !== "string") return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

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

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnverifiedEmail(null);
    setResentMsg(null);
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
      const msg = data?.error ?? "Ошибка входа";
      setError(msg);
      if (typeof msg === "string" && msg.toLowerCase().includes("не подтверждена")) {
        setUnverifiedEmail(String(body.email ?? ""));
      }
      return;
    }
    const target =
      safeRedirect(next) ?? safeRedirect(data.dashboard) ?? "/dashboard";
    router.push(target);
    router.refresh();
  }

  async function resend() {
    if (!unverifiedEmail) return;
    setResending(true);
    setResentMsg(null);
    const res = await fetch("/api/auth/resend-verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: unverifiedEmail }),
    });
    setResending(false);
    if (res.ok) {
      setResentMsg("Письмо отправлено. Проверьте почту, включая папку «Спам».");
    } else {
      setResentMsg("Не удалось отправить письмо. Попробуйте позже.");
    }
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" required autoFocus />
      </div>
      <div>
        <label className="label">Пароль</label>
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
      {error && <p className="text-sm text-accent">{error}</p>}
      {unverifiedEmail && (
        <div className="text-sm space-y-2">
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="text-accent hover:underline disabled:opacity-60"
          >
            {resending ? "Отправляем…" : "Отправить письмо подтверждения ещё раз"}
          </button>
          {resentMsg && <p className="text-ink-600 dark:text-ink-400">{resentMsg}</p>}
        </div>
      )}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Входим…" : "Войти"}
      </button>
      <p className="text-xs text-ink-500 dark:text-ink-400">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </form>
  );
}
