import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/search", title: "Что мне делать?", icon: "🔍" },
  { href: "/situations", title: "Ситуации", icon: "🧭" },
  { href: "/knowledge", title: "База знаний", icon: "📚" },
  { href: "/wins", title: "Победы", icon: "🏆" },
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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
      <div className="container-page flex items-center gap-4 h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink-900 dark:text-white group shrink-0"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl gradient-brand text-white text-base font-bold shadow-sm group-hover:shadow-lift transition-shadow">
            П!
          </span>
          <span className="font-extrabold text-xl tracking-tight">
            Право <span className="text-brand-600 dark:text-brand-400">имею</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-ink-700 dark:text-ink-300 ml-2">
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
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {session ? (
            <>
              <Link href={dashHref} className="btn-ghost text-sm py-2 px-3.5">
                {session.name ?? "Кабинет"}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm text-ink-500 dark:text-ink-400 hover:text-accent-600 px-2">
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
      <nav className="lg:hidden border-t border-ink-100 dark:border-ink-800 overflow-x-auto">
        <div className="container-page flex gap-1 text-xs font-medium text-ink-700 dark:text-ink-400 py-2 whitespace-nowrap">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-2.5 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              <span>{n.icon}</span>
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
