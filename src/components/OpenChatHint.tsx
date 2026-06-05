"use client";

export default function OpenChatHint() {
  return (
    <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
      Не подходит ответ?{" "}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-legal-chat"))}
        className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium transition-colors"
      >
        Уточните у ИИ-консультанта
      </button>
    </p>
  );
}
