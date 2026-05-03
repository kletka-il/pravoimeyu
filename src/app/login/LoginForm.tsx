"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    const target = next || data.dashboard || "/dashboard";
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
          {resentMsg && <p className="text-ink-600">{resentMsg}</p>}
        </div>
      )}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Входим…" : "Войти"}
      </button>
      <p className="text-xs text-ink-500">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </form>
  );
}
