import "dotenv/config";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!TOKEN) {
  console.error("Нет TELEGRAM_BOT_TOKEN в .env");
  process.exit(1);
}

const WEBHOOK_URL = "https://pravaimeu.ru/api/telegram/webhook";

const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: WEBHOOK_URL,
    secret_token: SECRET ?? undefined,
    allowed_updates: ["message", "callback_query"],
  }),
});

const data = await res.json();
console.log("setWebhook:", data);

// Проверяем текущий webhook
const info = await fetch(`https://api.telegram.org/bot${TOKEN}/getWebhookInfo`);
console.log("getWebhookInfo:", await info.json());
