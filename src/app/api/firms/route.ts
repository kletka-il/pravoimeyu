import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const firms = await prisma.lawFirm.findMany({
    where: { status: "APPROVED" },
    select: { id: true, name: true, address: true, description: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ firms });
}
