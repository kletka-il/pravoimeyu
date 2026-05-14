"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function LegalChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Привет! Я правовой помощник сайта «Права имею». Задайте любой юридический вопрос — постараюсь помочь разобраться.",
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Что-то пошло не так.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ошибка соединения. Попробуйте ещё раз." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-brand text-white shadow-lift flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Открыть правового помощника"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Окно чата */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl shadow-deep border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 overflow-hidden animate-slide-up">

          {/* Шапка */}
          <div className="flex items-center gap-3 px-4 py-3 gradient-brand text-white shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              П!
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Правовой помощник</div>
              <div className="text-xs text-white/70">Юридические вопросы · ИИ</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[380px] min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-[10px] font-bold mr-2 mt-0.5 shrink-0">
                    П
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-sm"
                      : "bg-ink-50 dark:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-[10px] font-bold mr-2 mt-0.5 shrink-0">
                  П
                </div>
                <div className="bg-ink-50 dark:bg-ink-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Быстрые подсказки (только если нет сообщений от пользователя) */}
          {messages.filter((m) => m.role === "user").length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {["Меня незаконно уволили", "Попал в ДТП", "Не платят зарплату"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                  className="text-xs px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="px-3 pb-3 pt-2 border-t border-ink-100 dark:border-ink-800 flex gap-2 items-end shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Опишите ситуацию…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white text-sm px-3 py-2.5 placeholder:text-ink-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-colors max-h-28 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 transition-opacity"
              aria-label="Отправить"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          <div className="px-4 pb-2.5 text-[10px] text-ink-400 dark:text-ink-600 text-center">
            Ответы носят информационный характер · Не заменяют консультацию юриста
          </div>
        </div>
      )}
    </>
  );
}
