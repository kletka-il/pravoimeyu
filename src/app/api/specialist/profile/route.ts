import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  yearsExperience: z.coerce.number().int().min(0).max(70),
  bio: z.string().max(2000).default(""),
  city: z.string().max(100).default(""),
  phone: z.string().max(40).default(""),
  pricePerHour: z.coerce.number().int().min(0).max(1_000_000),
  specializations: z.array(z.string()).default([]),
  credentials: z.array(z.string().max(200)).default([]),
});

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
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

  await prisma.specialistProfile.update({
    where: { userId: s.userId! },
    data: {
      yearsExperience: parsed.data.yearsExperience,
      bio: parsed.data.bio,
      city: parsed.data.city,
      phone: parsed.data.phone,
      pricePerHour: parsed.data.pricePerHour,
      specializations: parsed.data.specializations,
      credentials: parsed.data.credentials,
    },
  });
  return NextResponse.json({ ok: true });
}
