"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Msg = {
  id: string;
  text: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
};

export default function BookingChat({
  bookingId,
  currentUserId,
}: {
  bookingId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevLenRef = useRef(0);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      if (res.ok) setMessages(await res.json());
    } catch {}
  }, [bookingId]);

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 8000);
    return () => clearInterval(timer);
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length > prevLenRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });
    setSending(false);
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setText("");
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex flex-col h-[480px]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-ink-400 text-center py-8">
            Напишите первое сообщение
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender.id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  mine
                    ? "bg-accent text-white rounded-br-sm"
                    : "bg-ink-50 text-ink-900 rounded-bl-sm"
                }`}
              >
                {!mine && (
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {m.sender.name}
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {m.text}
                </p>
                <div className={`text-xs mt-1 ${mine ? "text-white/60 text-right" : "text-ink-400"}`}>
                  {new Date(m.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2 items-end border-t border-ink-100 pt-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Сообщение… (Enter — отправить, Shift+Enter — перенос)"
          className="input flex-1 resize-none text-sm"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="btn-primary py-2 px-4 text-sm shrink-0 self-end"
        >
          {sending ? "…" : "Отправить"}
        </button>
      </form>
    </div>
  );
}
