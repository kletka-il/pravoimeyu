import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(40).default(""),
  address: z.string().trim().max(300).default(""),
});

export async function PATCH(req: Request) {
  let s;
  try {
    s = await requireSession();
  } catch {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }
  await prisma.user.update({
    where: { id: s.userId! },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      address: parsed.data.address,
    },
  });
  return NextResponse.json({ ok: true });
}
