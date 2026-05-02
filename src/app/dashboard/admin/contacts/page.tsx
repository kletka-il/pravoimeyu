import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import MarkRead from "./MarkRead";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.ADMIN) redirect("/dashboard");

  const items = await prisma.contact.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <h2 className="heading-serif text-2xl">Обращения с сайта</h2>
      {items.length === 0 ? (
        <div className="card text-ink-500">Пока пусто.</div>
      ) : (
        items.map((c) => (
          <article key={c.id} className={`card ${!c.isRead ? "border-accent/40" : ""}`}>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-ink-500">{c.email}{c.phone ? ` · ${c.phone}` : ""}</div>
              </div>
              <div className="flex items-center gap-2">
                {!c.isRead && (
                  <span className="badge bg-accent text-white">Новое</span>
                )}
                <MarkRead id={c.id} isRead={c.isRead} />
              </div>
            </div>
            <p className="text-ink-700 mt-3 leading-relaxed whitespace-pre-line">
              {c.message}
            </p>
            <div className="text-xs text-ink-400 mt-2">
              {new Date(c.createdAt).toLocaleString("ru-RU")}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
