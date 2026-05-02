"use client";
import { useState } from "react";
import { SPECIALIZATIONS } from "@/lib/data/categories";

type Initial = {
  yearsExperience: number;
  bio: string;
  city: string;
  phone: string;
  pricePerHour: number;
  specializations: string[];
  credentials: string[];
};

export default function SpecialistProfileForm({ initial }: { initial: Initial }) {
  const [specs, setSpecs] = useState<string[]>(initial.specializations);
  const [creds, setCreds] = useState<string[]>(initial.credentials);
  const [credInput, setCredInput] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggleSpec(k: string) {
    setSpecs((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  }

  function addCredential() {
    const t = credInput.trim();
    if (!t) return;
    setCreds((c) => [...c, t]);
    setCredInput("");
  }

  function removeCredential(idx: number) {
    setCreds((c) => c.filter((_, i) => i !== idx));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      yearsExperience: Number(fd.get("yearsExperience") ?? 0),
      bio: String(fd.get("bio") ?? ""),
      city: String(fd.get("city") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      pricePerHour: Number(fd.get("pricePerHour") ?? 0),
      specializations: specs,
      credentials: creds,
    };
    const res = await fetch("/api/specialist/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) setState("ok");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Не удалось сохранить");
      setState("err");
    }
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Город</label>
          <input className="input" name="city" defaultValue={initial.city} />
        </div>
        <div>
          <label className="label">Стаж, лет</label>
          <input
            type="number"
            min="0"
            max="70"
            className="input"
            name="yearsExperience"
            defaultValue={initial.yearsExperience}
          />
        </div>
        <div>
          <label className="label">Цена, ₽/час</label>
          <input
            type="number"
            min="0"
            className="input"
            name="pricePerHour"
            defaultValue={initial.pricePerHour}
          />
        </div>
      </div>
      <div>
        <label className="label">Телефон</label>
        <input className="input" name="phone" defaultValue={initial.phone} />
      </div>
      <div>
        <label className="label">О себе</label>
        <textarea
          className="input min-h-[120px]"
          name="bio"
          defaultValue={initial.bio}
          placeholder="Чем занимаетесь, какие дела ведёте, чем выделяетесь."
        />
      </div>
      <div>
        <label className="label">Специализации</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SPECIALIZATIONS).map(([k, v]) => (
            <button
              type="button"
              key={k}
              onClick={() => toggleSpec(k)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                specs.includes(k)
                  ? "bg-accent text-white border-accent"
                  : "bg-white border-ink-200 text-ink-700 hover:border-accent"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Регалии</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={credInput}
            onChange={(e) => setCredInput(e.target.value)}
            placeholder="Например: МГУ, юрфак, 2010"
          />
          <button
            type="button"
            onClick={addCredential}
            className="btn-ghost"
          >
            Добавить
          </button>
        </div>
        {creds.length > 0 && (
          <ul className="mt-3 space-y-1">
            {creds.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-sm bg-ink-50 px-3 py-2 rounded">
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeCredential(i)}
                  className="text-ink-500 hover:text-accent"
                >
                  убрать
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {state === "ok" && <p className="text-sm text-green-700">Сохранено</p>}
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="btn-primary" disabled={state === "loading"}>
        {state === "loading" ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
