"use client";

const HINTS = ["Меня уволили без причины", "Попал в ДТП, я не виноват", "Управляйка не делает ремонт"];

function openChat(hint?: string) {
  const btn = document.querySelector('[aria-label="Открыть правового помощника"]') as HTMLButtonElement;
  if (btn) btn.click();
  if (hint) {
    setTimeout(() => {
      const ta = document.querySelector('textarea[placeholder]') as HTMLTextAreaElement;
      if (ta) {
        ta.value = hint;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.focus();
      }
    }, 300);
  }
}

export default function AiPromoButtons() {
  return (
    <div className="flex flex-col gap-3 md:w-72 shrink-0">
      <div className="flex flex-col gap-2">
        {HINTS.map(q => (
          <button
            key={q}
            className="text-left text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 transition-colors flex items-center justify-between gap-2 group"
            onClick={() => openChat(q)}
          >
            <span>{q}</span>
            <svg className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        ))}
      </div>
      <button
        className="bg-white text-brand-700 font-bold text-sm px-5 py-3 rounded-xl hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
        onClick={() => openChat()}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Задать вопрос бесплатно
      </button>
    </div>
  );
}
