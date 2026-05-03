import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-20">
      <div className="container-page py-12 grid md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl gradient-brand text-white text-base font-bold shadow-sm">
              П!
            </span>
            <span className="font-extrabold text-xl tracking-tight text-ink-900">
              Право <span className="text-brand-600">имею</span>
            </span>
          </Link>
          <p className="text-sm text-ink-500 max-w-xs leading-relaxed">
            Юридический портал для людей в сложной жизненной ситуации.
          </p>
          <div className="mt-4 text-xs text-ink-400 space-y-1">
            <div>ООО «Право имею»</div>
            <div>info@pravaimei.ru</div>
          </div>
        </div>
        <div>
          <div className="font-bold text-ink-900 mb-3 text-sm uppercase tracking-wider">
            Сайт
          </div>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/search" className="hover:text-brand-600 transition-colors">
                Что мне делать?
              </Link>
            </li>
            <li>
              <Link href="/situations" className="hover:text-brand-600 transition-colors">
                Жизненные ситуации
              </Link>
            </li>
            <li>
              <Link href="/knowledge" className="hover:text-brand-600 transition-colors">
                База знаний
              </Link>
            </li>
            <li>
              <Link href="/wins" className="hover:text-brand-600 transition-colors">
                Наши победы
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-ink-900 mb-3 text-sm uppercase tracking-wider">
            Сервис
          </div>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>
              <Link href="/app" className="hover:text-brand-600 transition-colors">
                Приложение
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-brand-600 transition-colors">
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-600 transition-colors">
                О компании
              </Link>
            </li>
            <li>
              <Link
                href="/register?role=SPECIALIST"
                className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
              >
                Юристам →
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-ink-900 mb-3 text-sm uppercase tracking-wider">
            Правовое
          </div>
          <ul className="space-y-2 text-sm text-ink-600 mb-4">
            <li>
              <Link href="/privacy" className="hover:text-brand-600 transition-colors">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-600 transition-colors">
                Реквизиты
              </Link>
            </li>
          </ul>
          <p className="text-xs text-ink-400 leading-relaxed">
            Информация носит справочный характер и не заменяет индивидуальной
            консультации.
          </p>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="container-page py-4 text-xs text-ink-400 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ООО «Право имею». Все права защищены.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-600 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/about" className="hover:text-brand-600 transition-colors">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
