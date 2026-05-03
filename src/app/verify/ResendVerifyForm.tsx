"use client";
import { useState } from "react";

export default function ResendVerifyForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/resend-verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Не удалось отправить письмо");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-ink-700 mt-4">
        Если такой адрес зарегистрирован — мы отправили на него новое письмо.
        Проверьте почту, в том числе папку «Спам».
      </p>
    );
  }

  return (
    <form className="space-y-3 mt-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Email для повторной отправки</label>
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.ru"
        />
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-outline" disabled={loading}>
        {loading ? "Отправляем…" : "Отправить письмо ещё раз"}
      </button>
    </form>
  );
}
