import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
    }
    const baseUrl = process.env.APP_URL || new URL(req.url).origin;
    await requestPasswordReset(email, baseUrl);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ ok: true });
  }
}
