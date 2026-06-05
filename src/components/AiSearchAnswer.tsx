"use client";

import { useEffect, useState } from "react";

export default function AiSearchAnswer({ query }: { query: string }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) return;
    setText("");
    setDone(false);
    setError(false);

    const controller = new AbortController();

    fetch(`/api/search/ai-answer?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok || !res.body) { setError(true); return; }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done: d, value } = await reader.read();
          if (d) break;
          setText((prev) => prev + decoder.decode(value));
        }
        setDone(true);
      })
      .catch(() => setError(true));

    return () => controller.abort();
  }, [query]);

  if (error) return null;

  return (
    <div>
      {!text && !done ? (
        <div className="flex items-center gap-2 text-sm text-ink-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          ИИ формулирует ответ…
        </div>
      ) : (
        <div className="text-ink-800 dark:text-ink-200 leading-relaxed whitespace-pre-wrap">
          {text}
          {!done && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-brand-500 animate-pulse rounded-sm align-middle" />
          )}
        </div>
      )}
    </div>
  );
}
