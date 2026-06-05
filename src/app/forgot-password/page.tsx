"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
    } else {
      setError("Что-то пошло не так. Попробуйте позже.");
    }
  }

  return (
    <div className="container-page py-16 max-w-md">
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
        Личный кабинет
      </div>
      <h1 className="heading-serif text-4xl mb-2">Забыли пароль? 🔑</h1>
      <p className="text-ink-500 mb-8">
        Введите почту — мы отправим ссылку для сброса пароля.
      </p>

      {done ? (
        <div className="card space-y-4">
          <p className="text-ink-700">
            Если аккаунт с такой почтой существует, письмо уже в пути. Проверьте
            входящие и папку «Спам».
          </p>
          <Link href="/login" className="btn-primary w-full text-center block">
            Вернуться ко входу
          </Link>
        </div>
      ) : (
        <form className="card space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="example@mail.ru"
            />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Отправляем…" : "Отправить ссылку"}
          </button>
          <p className="text-xs text-ink-500">
            Вспомнили пароль?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Войти
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
