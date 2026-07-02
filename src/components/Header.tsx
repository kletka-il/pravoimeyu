import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/search",       title: "Что мне делать?" },
  { href: "/specialists",  title: "Юристы" },
  { href: "/situations",   title: "Ситуации" },
  { href: "/knowledge",    title: "База знаний" },
  { href: "/calculators",  title: "Калькуляторы" },
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
    <header className="sticky top-0 z-30 glass-nav">
      {/* Тонкая информационная полоса */}
      <div className="hidden lg:block border-b border-ink-900/[0.05] dark:border-white/[0.06]">
        <div className="container-page flex items-center justify-between h-9 text-xs">
          <div className="flex items-center gap-5 text-ink-500 dark:text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              <span>Юристы онлайн 24/7</span>
            </span>
            <span className="text-ink-300 dark:text-ink-600">·</span>
            <span>Бесплатный поиск ответа</span>
            <span className="text-ink-300 dark:text-ink-600">·</span>
            <span>Ответ юриста — от 5 минут</span>
          </div>
          <div className="flex items-center gap-5 text-ink-500 dark:text-ink-400">
            <Link href="/contacts" className="hover:text-brand-700 dark:hover:text-brand-300 transition-colors">Контакты</Link>
            <Link href="/about" className="hover:text-brand-700 dark:hover:text-brand-300 transition-colors">О нас</Link>
            <Link
              href="/register?role=SPECIALIST"
              className="font-semibold text-sun-600 dark:text-sun-400 hover:text-sun-700 dark:hover:text-sun-300 transition-colors"
            >
              Юристам →
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex items-center gap-4 h-16">

        {/* Логотип: сапфировый монограм + серифный wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink-900 dark:text-white group shrink-0"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl gradient-brand text-white text-xs font-extrabold shadow-cta group-hover:shadow-lift transition-shadow">
            П!
          </span>
          <span className="heading-display font-bold text-[1.15rem] leading-none tracking-tight">
            Права имею
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium text-ink-600 dark:text-ink-300 ml-5">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3.5 py-2 rounded-full hover:bg-ink-900/[0.045] dark:hover:bg-white/[0.07] hover:text-ink-900 dark:hover:text-white transition-colors"
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
              <Link href={dashHref} className="btn-ghost text-sm py-2 px-4">
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
                className="hidden sm:inline-block text-sm font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white px-3.5 py-2 rounded-full hover:bg-ink-900/[0.045] dark:hover:bg-white/[0.07] transition-colors"
              >
                Войти
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4 rounded-full">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav — горизонтальный скролл */}
      <nav className="lg:hidden border-t border-ink-900/[0.05] dark:border-white/[0.06] overflow-x-auto">
        <div className="container-page flex gap-1 text-xs font-medium text-ink-600 dark:text-ink-400 py-2 whitespace-nowrap">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-full bg-ink-900/[0.03] dark:bg-white/[0.05] hover:bg-ink-900/[0.06] dark:hover:bg-white/[0.1] hover:text-ink-900 dark:hover:text-white transition-colors"
            >
              {n.title}
            </Link>
          ))}
          <Link
            href="/contacts"
            className="px-3 py-1.5 rounded-full bg-ink-900/[0.03] dark:bg-white/[0.05] hover:bg-ink-900/[0.06] dark:hover:bg-white/[0.1] hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            Контакты
          </Link>
        </div>
      </nav>
    </header>
  );
}
