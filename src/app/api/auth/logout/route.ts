import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const s = await getSession();
  s.destroy();
  return NextResponse.redirect(new URL("/", process.env.APP_URL || "http://localhost:3000"), {
    status: 303,
  });
}

export async function GET() {
  return POST();
}
