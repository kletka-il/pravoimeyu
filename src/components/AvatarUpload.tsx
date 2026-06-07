"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AvatarUpload({ currentUrl }: { currentUrl?: string }) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Нужно изображение (JPG, PNG, WebP)");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setStatus("loading");
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/specialist/avatar", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ошибка загрузки");
      setStatus("err");
      return;
    }
    setStatus("ok");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-5">
      {/* Превью */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 transition-colors shrink-0 bg-ink-50 dark:bg-ink-800 flex items-center justify-center group"
      >
        {preview ? (
          <Image src={preview} alt="Аватар" fill className="object-cover" unoptimized />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ink-300 group-hover:text-brand-400 transition-colors">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        )}
        {/* Оверлей при ховере */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </button>

      {/* Текст и кнопка */}
      <div className="min-w-0">
        <div className="font-medium text-sm text-ink-800 dark:text-ink-200">Фото профиля</div>
        <div className="text-xs text-ink-400 mt-0.5">JPG, PNG, WebP · до 3 МБ</div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2 transition-colors"
        >
          {preview ? "Изменить фото" : "Загрузить фото"}
        </button>
        {status === "loading" && (
          <div className="text-xs text-ink-400 mt-1">Загружаю…</div>
        )}
        {status === "ok" && (
          <div className="text-xs text-green-600 mt-1">Сохранено</div>
        )}
        {error && (
          <div className="text-xs text-accent mt-1">{error}</div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
