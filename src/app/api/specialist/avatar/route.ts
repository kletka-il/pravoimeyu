import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let s;
  try {
    s = await requireRole(ROLE.SPECIALIST);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Нужно изображение" }, { status: 400 });
  }
  if (file.size > 3 * 1024 * 1024) {
    return NextResponse.json({ error: "Файл слишком большой (макс 3 МБ)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const { url } = await put(`avatars/${s.userId}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  await prisma.specialistProfile.update({
    where: { userId: s.userId! },
    data: { avatarUrl: url },
  });

  return NextResponse.json({ url });
}
