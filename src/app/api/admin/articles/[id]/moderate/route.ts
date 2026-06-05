import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ROLE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().default(""),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireRole(ROLE.ADMIN);
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
      { status: 400 },
    );
  }

  const { action, reason } = parsed.data;

  try {
    const updated = await prisma.article.update({
      where: { id: params.id },
      data:
        action === "approve"
          ? { status: "APPROVED", isPublished: true, rejectionReason: "" }
          : { status: "REJECTED", isPublished: false, rejectionReason: reason },
    });
    return NextResponse.json({ article: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
