import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/search",      title: "Что мне делать?" },
  { href: "/situations",  title: "Ситуации" },
  { href: "/knowledge",   title: "База знаний" },
  { href: "/calculators", title: "Калькуляторы" },
  { href: "/wins",        title: "Победы" },
];

export default function Header({
  session,
}: {
  session: { name: string | null; role: Role | null } | null;
}) {
  const dashHref =
    session?.role === ROLE.ADMIN
      ? "/dashboard/admin"
      : session?.role === ROLE.SPECIALIST
        ? "/dashboard/specialist"
        : "/dashboard/client";

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800">
      {/* Trust-полоса вместо тёмного topbar — дружелюбные факты, как у Озон/WB */}
      <div className="hidden lg:block bg-brand-50 dark:bg-brand-950/40 border-b border-brand-100 dark:border-brand-900">
        <div className="container-page flex items-center justify-between h-9 text-xs">
          <div className="flex items-center gap-5 text-ink-700 dark:text-ink-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              <span>Юристы онлайн 24 / 7</span>
            </span>
            <span>·</span>
            <span>Бесплатный поиск ответа</span>
            <span>·</span>
            <span>Ответ юриста — от 5 минут</span>
          </div>
          <div className="flex items-center gap-4 text-ink-600 dark:text-ink-400">
            <Link href="/contacts" className="hover:text-brand-700 transition-colors">Контакты</Link>
            <Link href="/about"    className="hover:text-brand-700 transition-colors">О нас</Link>
            <Link
              href="/register?role=SPECIALIST"
              className="font-semibold text-gold hover:text-gold-light transition-colors"
            >
              Юристам →
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex items-center gap-4 h-16">

        {/* Logo — синяя плитка с жёлтым акцентом, без violet glow */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink-900 dark:text-white group shrink-0"
        >
          <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-700 text-white text-sm font-extrabold shadow-soft group-hover:bg-brand-800 transition-colors">
            П
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sun-400 border-2 border-white dark:border-ink-950" />
          </span>
          <span className="font-extrabold text-lg text-ink-900 dark:text-white tracking-tight">
            Права имею
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-ink-700 dark:text-ink-300 ml-4">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              {n.title}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {session ? (
            <>
              <Link href={dashHref} className="btn-ghost text-sm py-2 px-3.5">
                {session.name ?? "Кабинет"}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm text-ink-400 dark:text-ink-500 hover:text-accent-600 px-2 transition-colors">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-ink-700 dark:text-ink-300 hover:text-brand-700 dark:hover:text-brand-300 px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
              >
                Войти
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav — горизонтальный скролл с категориями, как в маркетплейсе */}
      <nav className="lg:hidden border-t border-ink-100 dark:border-ink-800 overflow-x-auto">
        <div className="container-page flex gap-1 text-xs font-medium text-ink-700 dark:text-ink-400 py-2 whitespace-nowrap">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-2.5 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              {n.title}
            </Link>
          ))}
          <Link
            href="/contacts"
            className="px-2.5 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            Контакты
          </Link>
        </div>
      </nav>
    </header>
  );
}
