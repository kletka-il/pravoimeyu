import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ROLE, type Role } from "@/lib/constants";

const navByRole: Record<Role, { href: string; title: string }[]> = {
  CLIENT: [
    { href: "/dashboard/client", title: "Главная" },
    { href: "/dashboard/client/bookings", title: "Мои обращения" },
    { href: "/dashboard/client/profile", title: "Мой профиль" },
  ],
  SPECIALIST: [
    { href: "/dashboard/specialist", title: "Профиль" },
    { href: "/dashboard/specialist/bookings", title: "Обращения клиентов" },
  ],
  ADMIN: [
    { href: "/dashboard/admin", title: "Сводка" },
    { href: "/dashboard/admin/specialists", title: "Юристы" },
    { href: "/dashboard/admin/articles", title: "Статьи" },
    { href: "/dashboard/admin/contacts", title: "Обращения с сайта" },
    { href: "/dashboard/admin/firms", title: "Конторы" },
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSession();
  if (!s.userId || !s.role) redirect("/login?next=/dashboard");
  const role = s.role as Role;
  const baseItems = navByRole[role];

  // Добавляем "Моя контора" если пользователь является владельцем фирмы
  const ownedFirm = await prisma.lawFirm.findUnique({
    where: { ownerId: s.userId! },
    select: { id: true },
  });
  const items = ownedFirm
    ? [...baseItems, { href: "/dashboard/firm", title: "Моя контора" }]
    : baseItems;

  const roleLabel =
    role === ROLE.ADMIN
      ? "Администратор"
      : role === ROLE.SPECIALIST
        ? "Юрист"
        : "Клиент";

  return (
    <div className="container-page py-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-semibold">
            Кабинет · {roleLabel}
          </div>
          <h1 className="heading-serif text-3xl">Здравствуйте, {s.name}</h1>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="btn-ghost text-sm">Выйти</button>
        </form>
      </div>
      <nav className="flex gap-2 flex-wrap mb-8 border-b border-ink-100 pb-4">
        {items.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="px-3 py-1.5 rounded-full text-sm border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:border-accent hover:text-accent transition"
          >
            {n.title}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
