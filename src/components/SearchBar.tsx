"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SearchBar({
  initial = "",
  size = "lg",
  placeholder = "Например: попал в аварию, виноват не я — что делать?",
}: {
  initial?: string;
  size?: "lg" | "md";
  placeholder?: string;
}) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-stretch gap-2 ${size === "lg" ? "shadow-card" : ""}`}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-white border border-ink-200 rounded-l-md px-4 ${
          size === "lg" ? "py-4 text-lg" : "py-3"
        } text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20`}
      />
      <button
        type="submit"
        className={`bg-accent text-white font-medium rounded-r-md ${
          size === "lg" ? "px-7 text-lg" : "px-5"
        } hover:bg-accent-dark transition`}
      >
        Найти ответ
      </button>
    </form>
  );
}
