import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Ты — «Правовой помощник» сайта «Права имею» (pravaimeu.ru). Пользователь задал вопрос через поиск, и база статей не нашла точного совпадения. Дай краткий конкретный юридический ответ. Говори просто, без жаргона. Ссылайся на конкретные статьи закона, если уместно. Ответ — не длиннее 200 слов. Если вопрос не правовой — мягко об этом скажи.`;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return new Response("no query", { status: 400 });

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 450,
    system: SYSTEM,
    messages: [{ role: "user", content: q }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
