import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const specialist = await prisma.specialistProfile.findUnique({
    where: { id: params.id, status: "APPROVED" },
    include: { user: { select: { name: true } } },
  });

  if (!specialist) {
    return NextResponse.json({ error: "Не найден" }, { status: 404 });
  }

  return NextResponse.json({ specialist });
}
