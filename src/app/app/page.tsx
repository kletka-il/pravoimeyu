import Link from "next/link";

export const metadata = { title: "Приложение «Право имею»" };

export default function AppPage() {
  return (
    <div className="container-page py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-semibold">
            PWA приложение
          </div>
          <h1 className="heading-serif text-4xl md:text-5xl mt-3">
            «Право имею» в кармане
          </h1>
          <p className="text-ink-600 mt-4 text-lg leading-relaxed">
            Установите портал как приложение — иконка появится на главном экране,
            запускается без браузера, базовые статьи доступны{" "}
            <b>даже без интернета</b>.
          </p>

          <div className="mt-8 space-y-4">
            <Step
              icon="📱"
              title="На iPhone / iPad"
              text="Откройте сайт в Safari → нажмите «Поделиться» → «На экран „Домой“». Приложение появится среди обычных значков."
            />
            <Step
              icon="🤖"
              title="На Android"
              text="Откройте сайт в Chrome → меню (⋮) → «Установить приложение». Готово, ярлык на главном экране."
            />
            <Step
              icon="💻"
              title="На компьютере"
              text="В Chrome или Edge — справа от адресной строки появится значок установки. Откроется как отдельное окно без вкладок."
            />
          </div>

          <div className="mt-10 flex gap-3">
            <Link href="/" className="btn-primary">
              Открыть приложение
            </Link>
            <Link href="/knowledge" className="btn-ghost">
              Посмотреть базу знаний
            </Link>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-ink-900 to-ink-800 text-white border-0">
          <h2 className="heading-serif text-white text-2xl mb-4">
            Что доступно офлайн
          </h2>
          <ul className="space-y-3 text-ink-100">
            <Item>Главная страница и поиск по ранее загруженным статьям</Item>
            <Item>Все статьи из базы знаний, которые вы уже открывали</Item>
            <Item>Список жизненных ситуаций и категорий</Item>
            <Item>Контакты юристов, которых вы добавили в избранное</Item>
          </ul>
          <h2 className="heading-serif text-white text-2xl mt-8 mb-4">
            Зачем это
          </h2>
          <ul className="space-y-3 text-ink-100">
            <Item>В отделении полиции / на месте ДТП интернет может пропасть</Item>
            <Item>В дороге, в метро, в загородном доме связь нестабильна</Item>
            <Item>Срочная подсказка должна быть под рукой за 1 секунду</Item>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Step({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card flex items-start gap-3">
      <div className="text-3xl shrink-0">{icon}</div>
      <div>
        <h3 className="heading-serif text-lg">{title}</h3>
        <p className="text-sm text-ink-600 mt-1">{text}</p>
      </div>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-gold mt-1">✓</span>
      <span>{children}</span>
    </li>
  );
}
