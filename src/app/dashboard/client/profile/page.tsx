import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import ClientProfileForm from "./ClientProfileForm";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage() {
  const s = await getSession();
  if (!s.userId || s.role !== ROLE.CLIENT) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: s.userId },
    select: { name: true, email: true, phone: true, address: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="heading-serif text-2xl">Мой профиль</h2>
      <div className="card text-sm text-ink-500 space-y-1">
        <div><span className="text-ink-400">Email:</span> {user.email}</div>
        <div><span className="text-ink-400">Аккаунт создан:</span> {new Date(user.createdAt).toLocaleDateString("ru-RU")}</div>
      </div>
      <ClientProfileForm
        initial={{ name: user.name, phone: user.phone, address: user.address }}
      />
    </div>
  );
}
