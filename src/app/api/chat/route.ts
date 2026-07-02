import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CHAT_LIMIT = 3;

const SYSTEM_PROMPT = `Ты — «Правовой помощник» сайта «Права имею» (pravaimei.ru), юридический ИИ-ассистент для граждан России.

ТВОЯ РОЛЬ:
Помогаешь людям разобраться в правовых ситуациях: объясняешь законы, права, порядок действий, сроки, инстанции. Говоришь просто и понятно — без лишнего юридического жаргона.

ТЕМЫ, КОТОРЫЕ ОБСУЖДАЕШЬ:
- Трудовые споры (увольнение, зарплата, отпуск, охрана труда)
- ДТП, штрафы, лишение прав, ГИБДД
- Семейное право (развод, алименты, раздел имущества, опека)
- Жильё и ЖКХ (аренда, соседи, управляющие компании, приватизация)
- Защита прав потребителей (возврат, некачественный товар, услуги)
- Кредиты и долги (коллекторы, банкротство, реструктуризация)
- Уголовное и административное право (права при задержании, штрафы)
- Наследство и недвижимость
- Миграционные вопросы
- Конституционные права граждан
- Обращения в суд, прокуратуру, Роспотребнадзор и другие органы

ПРАВИЛА:
1. Если вопрос НЕ связан с правом и юридическими вопросами — вежливо откажи и напомни, что ты специализируешься только на правовой помощи.
2. Никогда не давай медицинских, финансово-инвестиционных или технических советов вне правового контекста.
3. Всегда добавляй оговорку, что твой ответ носит информационный характер и для конкретной ситуации лучше проконсультироваться с юристом.
4. Ссылайся на актуальное российское законодательство (ГК РФ, ТК РФ, КоАП РФ, УК РФ и т.д.) где уместно.
5. Отвечай на русском языке, дружелюбно и по делу.
6. Если ситуация серьёзная (уголовное дело, крупный иск) — настойчиво рекомендуй обратиться к специалисту с сайта «Права имею».
7. В конце каждого ответа добавляй короткий блок: предложи найти юриста на сайте «Права имею» — там зарегистрированы проверенные специалисты. Используй формат: «⚖️ Нужна личная консультация? Найдите юриста на сайте →» (без телефонов и почт — только ссылка на сайт).

Формат ответа: структурированный, с пунктами если нужно. Не слишком длинный — человек должен легко прочитать с телефона.`;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session.userId;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { chatUsed: true },
      });
      if (user && user.chatUsed >= CHAT_LIMIT) {
        return NextResponse.json(
          { error: `Вы использовали все ${CHAT_LIMIT} бесплатных запроса к ИИ-помощнику. Свяжитесь с юристом напрямую на сайте.`, limitReached: true },
          { status: 429 },
        );
      }
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Нет сообщений" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { chatUsed: { increment: 1 } },
      });
    }

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "limitReached") {
      return NextResponse.json(
        { error: "Лимит запросов исчерпан.", limitReached: true },
        { status: 429 },
      );
    }
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера. Попробуйте позже." },
      { status: 500 },
    );
  }
}
