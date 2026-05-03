import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-24">
      <div className="container-page py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="heading-serif text-2xl">Право имею</div>
          <p className="text-sm text-ink-500 mt-2 max-w-xs">
            Юридический портал для людей в сложной жизненной ситуации.
          </p>
          <div className="mt-4 text-xs text-ink-400 space-y-1">
            <div>ООО «Право имею»</div>
            <div>info@pravaimei.ru</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-ink-900 mb-2">Сайт</div>
          <ul className="space-y-1 text-sm text-ink-600">
            <li>
              <Link href="/search" className="hover:text-accent">
                Что мне делать?
              </Link>
            </li>
            <li>
              <Link href="/situations" className="hover:text-accent">
                Жизненные ситуации
              </Link>
            </li>
            <li>
              <Link href="/knowledge" className="hover:text-accent">
                База знаний
              </Link>
            </li>
            <li>
              <Link href="/wins" className="hover:text-accent">
                Наши победы
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink-900 mb-2">Сервис</div>
          <ul className="space-y-1 text-sm text-ink-600">
            <li>
              <Link href="/app" className="hover:text-accent">
                Приложение
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-accent">
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent">
                О компании
              </Link>
            </li>
            <li>
              <Link href="/register?role=SPECIALIST" className="hover:text-accent">
                Юристам
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink-900 mb-2">Правовые документы</div>
          <ul className="space-y-1 text-sm text-ink-600 mb-4">
            <li>
              <Link href="/privacy" className="hover:text-accent">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent">
                Реквизиты компании
              </Link>
            </li>
          </ul>
          <p className="text-xs text-ink-500 leading-relaxed">
            Информация носит справочный характер и не заменяет индивидуальной
            консультации. Просмотр сайта не создаёт отношений адвокат–клиент.
          </p>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="container-page py-4 text-xs text-ink-400 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} ООО «Право имею». Все права защищены.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent">
              Конфиденциальность
            </Link>
            <Link href="/about" className="hover:text-accent">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
