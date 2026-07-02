import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-ink-950 text-ink-300 overflow-hidden">
      {/* Сапфировое свечение сверху */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-40 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(42rem 16rem at 50% 0%, rgba(58,107,242,0.16), transparent 70%)",
        }}
      />
      <div className="divider-fade" />

      <div className="container-page relative pt-16 pb-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl gradient-brand text-white text-xs font-extrabold shadow-cta">
              П!
            </span>
            <span className="heading-display font-bold text-xl text-white tracking-tight">
              Права имею
            </span>
          </Link>
          <p className="text-sm text-ink-400 max-w-xs leading-relaxed mb-5">
            Юридический портал для людей в сложной жизненной ситуации:
            найдём ответ, подскажем порядок действий, подберём юриста.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            <span className="text-xs text-ink-300">Онлайн 24/7</span>
          </div>
          <div className="mt-4 text-xs text-ink-500 space-y-1">
            <div>ООО «Права имею»</div>
            <a href="tel:+74993906497" className="block hover:text-ink-300 transition-colors">+7 (499) 390-64-97</a>
            <a href="mailto:p1ava.imeu@gmail.com" className="block hover:text-ink-300 transition-colors">p1ava.imeu@gmail.com</a>
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href="https://t.me/+74993906497"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-ink-300 hover:text-white hover:bg-[#2AABEE] hover:border-transparent transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.93 13.63l-2.98-.924c-.648-.204-.66-.648.136-.958l11.658-4.49c.537-.194 1.006.131.83.963l-.65-.001z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/74993906497"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-ink-300 hover:text-white hover:bg-[#25D366] hover:border-transparent transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Сайт */}
        <div>
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-[0.18em] mb-4">Сайт</div>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/search",       label: "Что мне делать?" },
              { href: "/specialists",  label: "Юристы" },
              { href: "/situations",   label: "Жизненные ситуации" },
              { href: "/knowledge",    label: "База знаний" },
              { href: "/calculators",  label: "Калькуляторы" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Сервис */}
        <div>
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-[0.18em] mb-4">Сервис</div>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/app",      label: "Приложение" },
              { href: "/contacts", label: "Контакты" },
              { href: "/about",    label: "О компании" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-400 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register?role=SPECIALIST"
                className="font-semibold text-sun-400 hover:text-sun-300 transition-colors"
              >
                Юристам →
              </Link>
            </li>
            <li>
              <Link
                href="/register-firm"
                className="font-semibold text-sun-400 hover:text-sun-300 transition-colors"
              >
                Зарегистрировать контору →
              </Link>
            </li>
          </ul>
        </div>

        {/* Правовое */}
        <div>
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-[0.18em] mb-4">Правовое</div>
          <ul className="space-y-2.5 text-sm mb-5">
            <li>
              <Link href="/privacy" className="text-ink-400 hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink-400 hover:text-white transition-colors">
                Реквизиты
              </Link>
            </li>
          </ul>
          <p className="text-xs text-ink-500 leading-relaxed">
            Информация носит справочный характер и не заменяет индивидуальной консультации.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.07]">
        <div className="container-page py-4 text-xs text-ink-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ООО «Права имею». Все права защищены.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-ink-300 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/about" className="hover:text-ink-300 transition-colors">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
