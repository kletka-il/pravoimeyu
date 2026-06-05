import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string().min(1, "Токен обязателен"),
  password: z
    .string()
    .min(8, "Пароль не короче 8 символов")
    .regex(/[A-Za-zА-Яа-я]/, "Должна быть буква")
    .regex(/[0-9]/, "Должна быть цифра"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 },
      );
    }
    const result = await resetPassword(parsed.data.token, parsed.data.password);
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json({ error: "Ошибка сервера. Попробуйте позже." }, { status: 500 });
  }
}
