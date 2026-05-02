"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Doc = {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  uploaderId: string;
  uploader: { name: string; role: string };
};

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export default function BookingDocuments({
  bookingId,
  currentUserId,
}: {
  bookingId: string;
  currentUserId: string;
}) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/documents`);
      if (res.ok) setDocs(await res.json());
    } catch {}
  }, [bookingId]);

  useEffect(() => { load(); }, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл превышает 10 МБ");
      return;
    }
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/bookings/${bookingId}/documents`, {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    if (res.ok) {
      const doc = await res.json();
      setDocs((prev) => [...prev, doc]);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d?.error ?? "Не удалось загрузить");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function remove(docId: string) {
    await fetch(`/api/bookings/${bookingId}/documents/${docId}`, { method: "DELETE" });
    setDocs((prev) => prev.filter((d) => d.id !== docId));
  }

  return (
    <div className="space-y-3">
      {docs.length === 0 && (
        <p className="text-sm text-ink-400">Нет прикреплённых файлов</p>
      )}
      {docs.map((d) => (
        <div key={d.id} className="flex items-center justify-between gap-2 border border-ink-100 rounded-md px-3 py-2">
          <div className="min-w-0">
            <a
              href={`/api/bookings/${bookingId}/documents/${d.id}`}
              className="text-sm text-accent hover:underline truncate block"
              download
            >
              {d.name}
            </a>
            <div className="text-xs text-ink-400">
              {fmt(d.size)} · {d.uploader.name} ·{" "}
              {new Date(d.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>
          {d.uploaderId === currentUserId && (
            <button
              onClick={() => remove(d.id)}
              className="text-xs text-ink-400 hover:text-accent shrink-0"
            >
              удалить
            </button>
          )}
        </div>
      ))}

      {error && <p className="text-sm text-accent">{error}</p>}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={upload}
          disabled={uploading}
        />
        <span className="btn-outline text-sm py-2 px-4">
          {uploading ? "Загрузка…" : "+ Прикрепить файл"}
        </span>
        <span className="text-xs text-ink-400">до 10 МБ</span>
      </label>
    </div>
  );
}
