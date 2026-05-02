"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consented) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }
    setState("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setState("success");
      e.currentTarget.reset();
      setConsented(false);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Не удалось отправить, попробуйте ещё раз");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="card">
        <h3 className="heading-serif text-2xl">Спасибо!</h3>
        <p className="text-ink-600 mt-2">
          Мы получили ваше сообщение и ответим в течение рабочего дня.
        </p>
        <button className="btn-outline mt-4" onClick={() => setState("idle")}>
          Отправить ещё одно
        </button>
      </div>
    );
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <h3 className="heading-serif text-2xl">Написать нам</h3>
      <div>
        <label className="label">Ваше имя</label>
        <input className="input" name="name" required minLength={2} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" name="email" required />
        </div>
        <div>
          <label className="label">Телефон (необязательно)</label>
          <input className="input" name="phone" />
        </div>
      </div>
      <div>
        <label className="label">Сообщение</label>
        <textarea className="input min-h-[120px]" name="message" required minLength={5} />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 accent-accent"
          required
        />
        <span className="text-sm text-ink-700">
          Нажимая «Отправить», я даю согласие на обработку персональных данных
          в соответствии с{" "}
          <Link href="/privacy" target="_blank" className="text-accent underline hover:no-underline">
            политикой конфиденциальности
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary" disabled={state === "loading" || !consented}>
        {state === "loading" ? "Отправляем…" : "Отправить"}
      </button>
    </form>
  );
}
