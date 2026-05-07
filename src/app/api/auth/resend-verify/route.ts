import { NextResponse } from "next/server";
import { z } from "zod";
import { resendVerification } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  try {
    const baseUrl = process.env.APP_URL ?? new URL(req.url).origin;
    const result = await resendVerification(parsed.data.email, baseUrl);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Не удалось отправить письмо. Попробуйте позже." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Не удалось отправить письмо";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
