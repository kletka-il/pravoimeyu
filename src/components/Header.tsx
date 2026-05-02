import Link from "next/link";
import { ROLE, type Role } from "@/lib/constants";

const navItems = [
  { href: "/search", title: "Что мне делать?" },
  { href: "/situations", title: "Жизненные ситуации" },
  { href: "/knowledge", title: "База знаний" },
  { href: "/wins", title: "Наши победы" },
  { href: "/app", title: "Приложение" },
  { href: "/contacts", title: "Контакты" },
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
    <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-ink-100">
      <div className="container-page flex items-center gap-6 h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl text-ink-900"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-accent text-white text-sm font-bold">
            ⚖
          </span>
          <span className="heading-serif text-2xl">Право имею</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-ink-700 ml-4">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-accent transition"
            >
              {n.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Link href={dashHref} className="btn-ghost text-sm">
                {session.name ?? "Кабинет"}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm text-ink-500 hover:text-accent">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-700 hover:text-accent"
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
      <nav className="lg:hidden border-t border-ink-100 overflow-x-auto">
        <div className="container-page flex gap-4 text-xs font-medium text-ink-700 py-2 whitespace-nowrap">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-accent">
              {n.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
