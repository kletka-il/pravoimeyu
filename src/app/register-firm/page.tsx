"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterFirmPage() {
  const [form, setForm] = useState({
    name: "", inn: "", address: "", phone: "", website: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/law-firm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Ошибка. Попробуйте позже.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="container-page py-16 max-w-xl">
        <div className="card space-y-4 text-center">
          <div className="text-4xl">⚖️</div>
          <h2 className="heading-serif text-2xl">Заявка отправлена</h2>
          <p className="text-ink-600">
            Ваша юридическая контора отправлена на проверку модератором.
            Как правило, проверка занимает до 1 рабочего дня.
          </p>
          <Link href="/dashboard" className="btn-primary w-full text-center block">
            В личный кабинет
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 max-w-2xl">
      <div className="mb-2 inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Регистрация конторы
      </div>
      <h1 className="heading-display text-3xl md:text-4xl mb-2">Зарегистрировать юридическую контору</h1>
      <p className="text-ink-500 mb-8 md:text-lg">
        После проверки модератором ваша контора появится на сайте. Юристы смогут вступить в неё через личный кабинет.
      </p>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="card space-y-4">
          <h2 className="heading-serif text-xl">Основная информация</h2>

          <div>
            <label className="label">Название конторы *</label>
            <input className="input" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="ООО «Юридическая группа»" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">ИНН *</label>
              <input className="input" value={form.inn} onChange={e => set("inn", e.target.value)} required placeholder="7710477337" maxLength={12} />
            </div>
            <div>
              <label className="label">Телефон</label>
              <input className="input" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+7 (495) 000-00-00" />
            </div>
          </div>

          <div>
            <label className="label">Юридический адрес *</label>
            <input className="input" value={form.address} onChange={e => set("address", e.target.value)} required placeholder="107023, г. Москва, ул. Примерная, д. 1" />
          </div>

          <div>
            <label className="label">Сайт</label>
            <input className="input" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://example.ru" type="url" />
          </div>

          <div>
            <label className="label">Описание деятельности</label>
            <textarea className="input min-h-[100px]" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Специализация, опыт, практика…" />
          </div>
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Отправляем…" : "Отправить на проверку"}
        </button>

        <p className="text-xs text-ink-400 text-center">
          После проверки модератором вы получите подтверждение.{" "}
          <Link href="/contacts" className="underline">Вопросы — в контакты</Link>.
        </p>
      </form>
    </div>
  );
}
