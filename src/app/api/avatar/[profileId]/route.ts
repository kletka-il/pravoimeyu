import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { profileId: string } }
) {
  const profile = await prisma.specialistProfile.findUnique({
    where: { id: params.profileId },
    select: { avatarUrl: true },
  });

  if (!profile?.avatarUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const match = profile.avatarUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return new NextResponse(null, { status: 404 });
  }

  const [, mimeType, base64Data] = match;
  const buffer = Buffer.from(base64Data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      // s-maxage: CDN кеш Vercel; max-age: браузер
      "Cache-Control": "public, s-maxage=86400, max-age=3600, stale-while-revalidate=604800",
    },
  });
}
