import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 mt-20">
      <div className="container-page py-12 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl gradient-brand text-white text-sm font-bold shadow-sm">
              П
            </span>
            <span className="font-display text-lg text-brand-700 dark:text-brand-400 tracking-wide">
              Право имею
            </span>
          </Link>
          <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs leading-relaxed">
            Юридический портал для людей в сложной жизненной ситуации.
          </p>
          <div className="mt-4 text-xs text-ink-400 dark:text-ink-500 space-y-1">
            <div>ООО «Право имею»</div>
            <div>p1ava.imeu@gmail.com</div>
          </div>
        </div>

        {/* Site links */}
        <div>
          <div className="font-bold text-ink-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
            Сайт
          </div>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
            {[
              { href: "/search",     label: "Что мне делать?" },
              { href: "/situations", label: "Жизненные ситуации" },
              { href: "/knowledge",  label: "База знаний" },
              { href: "/wins",       label: "Наши победы" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service links */}
        <div>
          <div className="font-bold text-ink-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
            Сервис
          </div>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
            {[
              { href: "/app",      label: "Приложение" },
              { href: "/contacts", label: "Контакты" },
              { href: "/about",    label: "О компании" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register?role=SPECIALIST"
                className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                Юристам →
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="font-bold text-ink-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
            Правовое
          </div>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400 mb-4">
            <li>
              <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Реквизиты
              </Link>
            </li>
          </ul>
          <p className="text-xs text-ink-400 dark:text-ink-500 leading-relaxed">
            Информация носит справочный характер и не заменяет индивидуальной консультации.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-100 dark:border-ink-800">
        <div className="container-page py-4 text-xs text-ink-400 dark:text-ink-500 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ООО «Право имею». Все права защищены.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
