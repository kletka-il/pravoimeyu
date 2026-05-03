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

  const isLg = size === "lg";

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-stretch gap-0 bg-white rounded-2xl ${
        isLg ? "shadow-lift p-1.5" : "shadow-soft p-1 border border-ink-100"
      }`}
    >
      <div className="flex-1 flex items-center gap-3 px-4">
        <svg
          className={`flex-shrink-0 ${isLg ? "w-6 h-6" : "w-5 h-5"} text-ink-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16z"
          />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent ${
            isLg ? "py-4 text-lg" : "py-2.5 text-base"
          } text-ink-900 placeholder:text-ink-400 focus:outline-none`}
        />
      </div>
      <button
        type="submit"
        className={`bg-brand-600 text-white font-semibold rounded-xl ${
          isLg ? "px-7 text-base" : "px-5 text-sm"
        } hover:bg-brand-700 active:scale-[0.98] transition-all whitespace-nowrap`}
      >
        Найти ответ
      </button>
    </form>
  );
}
