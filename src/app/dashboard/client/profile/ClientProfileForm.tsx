"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = { name: string; phone: string; address: string };

export default function ClientProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      address: String(fd.get("address") ?? "").trim(),
    };
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setState("ok");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Не удалось сохранить");
      setState("err");
    }
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">Имя</label>
        <input className="input" name="name" defaultValue={initial.name} required minLength={2} />
      </div>
      <div>
        <label className="label">Телефон</label>
        <input className="input" name="phone" defaultValue={initial.phone} placeholder="+7 (___) ___-__-__" />
      </div>
      <div>
        <label className="label">Адрес (для корреспонденции)</label>
        <input className="input" name="address" defaultValue={initial.address} placeholder="Город, улица, дом" />
      </div>
      {state === "ok" && <p className="text-sm text-green-700">Сохранено</p>}
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary" disabled={state === "loading"}>
        {state === "loading" ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
