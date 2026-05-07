import { NextResponse } from "next/server";
import { registerSchema, registerUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  try {
    const baseUrl = process.env.APP_URL ?? new URL(req.url).origin;
    const { userId, role, emailSent } = await registerUser(parsed.data, baseUrl);
    return NextResponse.json({ ok: true, userId, role, emailSent });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка регистрации";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
