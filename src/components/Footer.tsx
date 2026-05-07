import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-20 border-t-4 border-sun-400">
      <div className="container-page pt-14 pb-10 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-700 text-white text-sm font-extrabold shadow-soft group-hover:bg-brand-800 transition-colors">
              П
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sun-400 border-2 border-ink-900" />
            </span>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Права имею
            </span>
          </Link>
          <p className="text-sm text-ink-400 max-w-xs leading-relaxed mb-5">
            Юридический портал для людей в сложной жизненной ситуации.
          </p>
          {/* Pulse-индикатор «онлайн» */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            <span className="text-xs text-ink-400">Онлайн 24 / 7</span>
          </div>
          <div className="mt-3 text-xs text-ink-600 space-y-0.5">
            <div>ООО «Права имею»</div>
            <div>p1ava.imeu@gmail.com</div>
          </div>
        </div>

        {/* Сайт */}
        <div>
          <div className="text-xs font-bold text-ink-500 uppercase tracking-widest mb-4">Сайт</div>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/search",      label: "Что мне делать?" },
              { href: "/situations",  label: "Жизненные ситуации" },
              { href: "/knowledge",   label: "База знаний" },
              { href: "/calculators", label: "Калькуляторы" },
              { href: "/wins",        label: "Наши победы" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-400 hover:text-brand-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Сервис */}
        <div>
          <div className="text-xs font-bold text-ink-500 uppercase tracking-widest mb-4">Сервис</div>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/app",      label: "Приложение" },
              { href: "/contacts", label: "Контакты" },
              { href: "/about",    label: "О компании" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-400 hover:text-brand-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              {/* Gold-акцент — как на advokatdavidov.ru */}
              <Link
                href="/register?role=SPECIALIST"
                className="font-semibold transition-colors hover:text-yellow-300"
                style={{ color: "#c49b52" }}
              >
                Юристам →
              </Link>
            </li>
          </ul>
        </div>

        {/* Правовое */}
        <div>
          <div className="text-xs font-bold text-ink-500 uppercase tracking-widest mb-4">Правовое</div>
          <ul className="space-y-2.5 text-sm mb-5">
            <li>
              <Link href="/privacy" className="text-ink-400 hover:text-brand-400 transition-colors">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-ink-400 hover:text-brand-400 transition-colors">
                Реквизиты
              </Link>
            </li>
          </ul>
          <p className="text-xs text-ink-600 leading-relaxed">
            Информация носит справочный характер и не заменяет индивидуальной консультации.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-page py-4 text-xs text-ink-600 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ООО «Права имею». Все права защищены.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-400 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/about" className="hover:text-brand-400 transition-colors">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
