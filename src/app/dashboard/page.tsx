import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardIndex() {
  const s = await getSession();
  if (!s.userId) redirect("/login?next=/dashboard");
  if (s.role === ROLE.ADMIN) redirect("/dashboard/admin");
  if (s.role === ROLE.SPECIALIST) redirect("/dashboard/specialist");
  redirect("/dashboard/client");
}
