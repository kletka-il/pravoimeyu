"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };
const CHAT_REF_KEY = "chat_ref_ts";

function renderMd(text: string) {
  return text.split(/(\*\*[^*\n]+\*\*)/g).flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return [<strong key={i}>{part.slice(2, -2)}</strong>];
    }
    return part.split("\n").flatMap((line, j, arr) =>
      j < arr.length - 1 ? [line, <br key={`${i}-${j}`} />] : [line]
    );
  });
}

const HINTS = [
  "Меня незаконно уволили",
  "Попал в ДТП, не виноват",
  "Не платят зарплату",
  "Хочу вернуть товар",
  "Сосед затапливает",
];

export default function LegalChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-legal-chat", handler);
    return () => window.removeEventListener("open-legal-chat", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setShowBubble(false);
      if (messages.length === 0) {
        setMessages([{
          role: "assistant",
          content: "Привет! Я правовой ИИ-помощник сайта «Права имею». Опишите вашу ситуацию — разберёмся вместе.",
        }]);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      if (data.limitReached) {
        setLimitReached(true);
      }
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply ?? data.error ?? "Что-то пошло не так.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Ошибка соединения. Попробуйте ещё раз.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const hasUserMessages = messages.some(m => m.role === "user");

  return (
    <>
      {/* ── Плавающая кнопка ── */}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">

        {/* Всплывающая подсказка */}
        {showBubble && !open && (
          <div className="animate-slide-up bg-white dark:bg-ink-800 text-ink-900 dark:text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lift border border-ink-100 dark:border-ink-700 max-w-[220px] text-right">
            Есть юридический вопрос? Спросите ИИ 👋
            <button
              onClick={() => setShowBubble(false)}
              className="ml-2 text-ink-400 hover:text-ink-600 text-xs"
            >✕</button>
          </div>
        )}

        {/* Кнопка-пилюля */}
        <button
          onClick={() => setOpen(v => !v)}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full gradient-brand text-white font-semibold shadow-lift transition-all hover:scale-105 active:scale-95 ${!open ? "pr-4" : ""}`}
          aria-label="Открыть правового помощника"
        >
          {/* Пульс-точка */}
          {!open && (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
          )}
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
          <span className="text-sm">{open ? "Закрыть" : "ИИ-помощник"}</span>
        </button>
      </div>

      {/* ── Окно чата — мобайл: bottom sheet, десктоп: floating ── */}
      {open && (
        <>
          {/* Оверлей на мобильном */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />

          <div className={`
            fixed z-50 flex flex-col bg-white dark:bg-ink-900 overflow-hidden animate-slide-up
            /* Мобильный: bottom sheet */
            bottom-0 left-0 right-0 rounded-t-3xl shadow-deep border-t border-ink-100 dark:border-ink-700
            max-h-[85vh]
            /* Десктоп: floating window */
            lg:bottom-24 lg:right-4 lg:left-auto lg:w-[400px] lg:rounded-2xl lg:border lg:max-h-[580px]
          `}>

            {/* Шапка */}
            <div className="flex items-center gap-3 px-4 py-3.5 gradient-brand text-white shrink-0">
              {/* Drag handle на мобильном */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30 lg:hidden" />
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-sm shrink-0">
                П!
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">Правовой ИИ-помощник</div>
                <div className="flex items-center gap-1.5 text-xs text-white/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  Онлайн · Отвечает мгновенно
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors p-1" aria-label="Закрыть">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-[10px] font-bold mr-2 mt-0.5 shrink-0">П</div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-sm whitespace-pre-wrap"
                      : "bg-ink-50 dark:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-bl-sm"
                  }`}>
                    {m.role === "assistant" ? renderMd(m.content) : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-[10px] font-bold mr-2 mt-0.5 shrink-0">П</div>
                  <div className="bg-ink-50 dark:bg-ink-800 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Быстрые подсказки */}
            {!hasUserMessages && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {HINTS.map(hint => (
                  <button
                    key={hint}
                    onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}

            {/* CTA найти юриста — показываем если уже был хоть один ответ */}
            {hasUserMessages && !loading && (
              <div className="px-4 pb-2">
                <Link
                  href="/search"
                  onClick={() => localStorage.setItem(CHAT_REF_KEY, String(Date.now()))}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 text-sm font-semibold hover:bg-brand-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Найти юриста на сайте →
                </Link>
              </div>
            )}

            {/* Блок лимита исчерпан */}
            {limitReached && (
              <div className="mx-4 mb-3 p-3 rounded-xl bg-sun-50 border border-sun-200 text-sm text-ink-800">
                Лимит бесплатных запросов исчерпан.{" "}
                <Link href="/search" className="font-semibold text-brand-700 hover:underline">
                  Найдите юриста на сайте →
                </Link>
              </div>
            )}

            {/* Поле ввода */}
            <div className="px-3 pb-4 pt-2 border-t border-ink-100 dark:border-ink-800 flex gap-2 items-end shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Опишите вашу ситуацию…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-white text-sm px-3.5 py-3 placeholder:text-ink-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-colors max-h-32 overflow-y-auto"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading || limitReached}
                className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 transition-opacity"
                aria-label="Отправить"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>

            <div className="px-4 pb-3 text-[10px] text-ink-400 dark:text-ink-600 text-center leading-relaxed">
              Ответы носят информационный характер · Для сложных дел — обратитесь к юристу
            </div>
          </div>
        </>
      )}
    </>
  );
}
