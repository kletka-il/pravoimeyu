import { NextResponse } from "next/server";
import { authenticate, loginSchema } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { ROLE, type Role } from "@/lib/constants";

export const runtime = "nodejs";

const dashboardByRole: Record<Role, string> = {
  CLIENT: "/dashboard/client",
  SPECIALIST: "/dashboard/specialist",
  ADMIN: "/dashboard/admin",
};

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  try {
    const user = await authenticate(parsed.data.email, parsed.data.password);
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.role = user.role as Role;
    await session.save();
    const dashboard = dashboardByRole[user.role as Role] ?? ROLE.CLIENT;
    return NextResponse.json({ ok: true, dashboard });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка входа";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
