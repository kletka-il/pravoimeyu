import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";
const TG = `https://api.telegram.org/bot${TOKEN}`;

type SessionData = {
  name?: string;
  phone?: string;
  topic?: string;
  desc?: string;
};

const TOPICS: [string, string][] = [
  ["🚗 ДТП", "dtp"],
  ["💼 Работа", "work"],
  ["👨‍👩‍👧 Семья", "family"],
  ["🏠 Жильё", "housing"],
  ["🛒 Потребитель", "consumer"],
  ["💳 Кредиты", "credit"],
  ["⚖️ Уголовное", "criminal"],
  ["📋 Другое", "other"],
];

function topicsKeyboard() {
  const rows = [];
  for (let i = 0; i < TOPICS.length; i += 2) {
    rows.push(
      TOPICS.slice(i, i + 2).map(([label, key]) => ({
        text: label,
        callback_data: `topic:${key}`,
      })),
    );
  }
  return { inline_keyboard: rows };
}

async function tg(method: string, body: object) {
  await fetch(`${TG}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function reply(chatId: number, text: string, extra?: object) {
  await tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...extra });
}

export async function POST(req: NextRequest) {
  if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Callback query (button press)
  if (update.callback_query) {
    const cq = update.callback_query as {
      id: string;
      data: string;
      message: { chat: { id: number } };
    };
    const chatId = cq.message.chat.id;
    const chatIdBig = BigInt(chatId);

    await tg("answerCallbackQuery", { callback_query_id: cq.id });

    if (cq.data === "start_form") {
      await prisma.telegramSession.upsert({
        where: { chatId: chatIdBig },
        create: { chatId: chatIdBig, step: "WAITING_NAME", data: {} },
        update: { step: "WAITING_NAME", data: {} },
      });
      await reply(chatId, "Введите ваше имя:");
      return NextResponse.json({ ok: true });
    }

    if (cq.data?.startsWith("topic:")) {
      const key = cq.data.slice(6);
      const label = TOPICS.find(([, k]) => k === key)?.[0] ?? key;
      const session = await prisma.telegramSession.findUnique({ where: { chatId: chatIdBig } });
      const prev = (session?.data ?? {}) as SessionData;
      await prisma.telegramSession.update({
        where: { chatId: chatIdBig },
        data: { step: "WAITING_DESC", data: { ...prev, topic: label } },
      });
      await reply(chatId, `Тема: <b>${label}</b>\n\nОпишите вашу ситуацию подробнее:`);
      return NextResponse.json({ ok: true });
    }

    if (cq.data === "confirm") {
      const session = await prisma.telegramSession.findUnique({ where: { chatId: chatIdBig } });
      const d = (session?.data ?? {}) as SessionData;

      await prisma.contact.create({
        data: {
          name: d.name ?? "",
          email: `tg_${chatId}@pravaimeu.ru`,
          phone: d.phone ?? "",
          message: `[Telegram] Тема: ${d.topic}\n\n${d.desc}`,
        },
      });

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#11142a">
          <h2 style="font-family:Georgia,serif;color:#8a1538;margin:0 0 16px">Новое обращение через Telegram</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
            <tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap">Имя</td><td style="padding:6px 0"><b>${d.name}</b></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#666">Контакт</td><td style="padding:6px 0"><b>${d.phone}</b></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#666">Тема</td><td style="padding:6px 0"><b>${d.topic}</b></td></tr>
          </table>
          <div style="padding:16px;background:#f7f8fc;border-radius:8px;font-size:14px;color:#333;line-height:1.6">${(d.desc ?? "").replace(/\n/g, "<br>")}</div>
          <hr style="border:none;border-top:1px solid #e8ebf0;margin:24px 0"/>
          <p style="color:#9ea8ba;font-size:12px">Telegram chat ID: ${chatId} · Бот pravaimeu.ru</p>
        </div>`;

      try {
        await sendEmail({
          to: "p1ava.imeu@gmail.com",
          subject: `[TG] ${d.topic} — ${d.name}`,
          text: `Имя: ${d.name}\nКонтакт: ${d.phone}\nТема: ${d.topic}\n\n${d.desc}`,
          html,
        });
      } catch (err) {
        console.error("[tg-bot] email error:", err);
      }

      await prisma.telegramSession.delete({ where: { chatId: chatIdBig } });
      await reply(
        chatId,
        `✅ <b>Обращение принято!</b>\n\nМы свяжемся с вами по контакту: <b>${d.phone}</b>\n\nЕсли нужна ещё помощь — /start`,
      );
      return NextResponse.json({ ok: true });
    }

    if (cq.data === "cancel") {
      await prisma.telegramSession.deleteMany({ where: { chatId: chatIdBig } });
      await reply(chatId, "Отменено. Чтобы начать заново — /start");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  }

  // Regular message
  const msg = update.message as
    | { text?: string; chat: { id: number }; from?: { first_name?: string } }
    | undefined;
  if (!msg) return NextResponse.json({ ok: true });

  const { text, chat } = msg;
  const chatId = chat.id;
  const chatIdBig = BigInt(chatId);

  if (!text) return NextResponse.json({ ok: true });

  if (text.startsWith("/start")) {
    await prisma.telegramSession.deleteMany({ where: { chatId: chatIdBig } });
    await reply(
      chatId,
      `👋 Добро пожаловать в <b>«Права имею»</b>!\n\nЗдесь вы можете оставить обращение — наши специалисты свяжутся с вами в ближайшее время.\n\nНажмите кнопку ниже, чтобы начать:`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "📋 Оставить обращение", callback_data: "start_form" }]],
        },
      },
    );
    return NextResponse.json({ ok: true });
  }

  const session = await prisma.telegramSession.findUnique({ where: { chatId: chatIdBig } });

  if (!session) {
    await reply(chatId, `Нажмите /start, чтобы оставить обращение.`);
    return NextResponse.json({ ok: true });
  }

  const data = (session.data ?? {}) as SessionData;

  switch (session.step) {
    case "WAITING_NAME": {
      const name = text.trim();
      if (name.length < 2) {
        await reply(chatId, "Введите имя (минимум 2 символа).");
        break;
      }
      await prisma.telegramSession.update({
        where: { chatId: chatIdBig },
        data: { step: "WAITING_PHONE", data: { ...data, name } },
      });
      await reply(chatId, `Приятно познакомиться, <b>${name}</b>! 📞\n\nВведите номер телефона или другой способ связи:`);
      break;
    }

    case "WAITING_PHONE": {
      const phone = text.trim();
      if (phone.length < 5) {
        await reply(chatId, "Введите контакт для связи.");
        break;
      }
      await prisma.telegramSession.update({
        where: { chatId: chatIdBig },
        data: { step: "WAITING_TOPIC", data: { ...data, phone } },
      });
      await reply(chatId, "Выберите тему обращения:", { reply_markup: topicsKeyboard() });
      break;
    }

    case "WAITING_TOPIC": {
      await reply(chatId, "Пожалуйста, выберите тему из кнопок выше 👆", {
        reply_markup: topicsKeyboard(),
      });
      break;
    }

    case "WAITING_DESC": {
      const desc = text.trim();
      if (desc.length < 10) {
        await reply(chatId, "Опишите ситуацию подробнее (минимум 10 символов).");
        break;
      }
      await prisma.telegramSession.update({
        where: { chatId: chatIdBig },
        data: { step: "CONFIRMING", data: { ...data, desc } },
      });
      const d = { ...data, desc };
      await reply(
        chatId,
        `📋 <b>Ваше обращение:</b>\n\n👤 Имя: ${d.name}\n📞 Контакт: ${d.phone}\n🏷 Тема: ${d.topic}\n\n📝 Описание:\n${desc}\n\nВсё верно?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Отправить", callback_data: "confirm" },
                { text: "❌ Отмена", callback_data: "cancel" },
              ],
            ],
          },
        },
      );
      break;
    }

    default:
      await reply(chatId, `Нажмите /start, чтобы оставить обращение.`);
  }

  return NextResponse.json({ ok: true });
}
