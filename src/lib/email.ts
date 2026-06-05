import nodemailer from "nodemailer";

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (cachedTransport) return cachedTransport;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null; // dev режим — пишем в файл
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransport;
}

export async function sendEmail({ to, subject, text, html }: SendArgs) {
  const transport = getTransport();
  const from = process.env.SMTP_FROM || "Права имею <noreply@localhost>";

  if (!transport) {
    console.error(`[email] SMTP не настроен. Письмо не отправлено → ${to} | ${subject}`);
    throw new Error("Сервис отправки писем не настроен. Обратитесь к администратору.");
  }

  await transport.sendMail({ from, to, subject, text, html });
  return { ok: true };
}

export function buildNewBookingEmail(
  specialistName: string,
  clientName: string,
  question: string,
  bookingId: string,
) {
  const preview = question.substring(0, 300) + (question.length > 300 ? "…" : "");
  const url = `${process.env.APP_URL}/dashboard/specialist/bookings/${bookingId}`;
  const text = `Здравствуйте, ${specialistName}!\n\nК вам поступило новое обращение от клиента ${clientName}.\n\nВопрос:\n${preview}\n\nОткройте кабинет, чтобы ответить:\n${url}\n\n— Команда «Права имею»`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#11142a">
      <h1 style="font-family:Georgia,serif;color:#11142a;margin:0 0 12px">Новое обращение</h1>
      <p>Здравствуйте, <b>${specialistName}</b>!</p>
      <p>К вам поступило новое обращение от клиента <b>${clientName}</b>.</p>
      <p style="margin:16px 0;padding:16px;background:#f7f8fc;border-radius:8px;font-size:14px;color:#333;line-height:1.6">${preview}</p>
      <p style="margin:24px 0">
        <a href="${url}" style="background:#8a1538;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block">Ответить клиенту</a>
      </p>
      <hr style="border:none;border-top:1px solid #e8ebf0;margin:24px 0" />
      <p style="color:#9ea8ba;font-size:12px">— Команда «Права имею»</p>
    </div>
  `;
  return { text, html };
}

export function buildBookingStatusEmail(
  clientName: string,
  specialistName: string,
  status: string,
  question: string,
) {
  const statusLabels: Record<string, string> = {
    ACCEPTED: "принято в работу",
    IN_PROGRESS: "в работе — юрист изучает материалы",
    CLOSED: "закрыто",
    CANCELLED: "отменено",
  };
  const label = statusLabels[status] ?? status.toLowerCase();
  const text = `Здравствуйте, ${clientName}!\n\nСтатус вашего обращения к юристу ${specialistName} изменился: ${label}.\n\nВаш вопрос: ${question}\n\nОткройте личный кабинет, чтобы узнать подробности:\n${process.env.APP_URL}/dashboard/client/bookings\n\n— Команда «Права имею»`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#11142a">
      <h1 style="font-family:Georgia,serif;color:#11142a;margin:0 0 12px">Обновление по вашему обращению</h1>
      <p>Здравствуйте, <b>${clientName}</b>!</p>
      <p>Обращение к юристу <b>${specialistName}</b> изменило статус:</p>
      <p style="font-size:18px;font-weight:bold;color:#8a1538;margin:16px 0">${label}</p>
      <p style="color:#666;font-size:13px">Ваш вопрос: ${question.substring(0, 200)}${question.length > 200 ? "…" : ""}</p>
      <p style="margin:24px 0">
        <a href="${process.env.APP_URL}/dashboard/client/bookings" style="background:#8a1538;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block">Открыть кабинет</a>
      </p>
      <hr style="border:none;border-top:1px solid #e8ebf0;margin:24px 0" />
      <p style="color:#9ea8ba;font-size:12px">— Команда «Права имею»</p>
    </div>
  `;
  return { text, html };
}

export function buildPasswordResetEmail(name: string, link: string) {
  const text = `Здравствуйте, ${name}!\n\nВы запросили сброс пароля на портале «Права имею».\nПерейдите по ссылке, чтобы задать новый пароль:\n\n${link}\n\nСсылка действует 1 час.\nЕсли вы не запрашивали сброс — просто проигнорируйте письмо.\n\n— Команда «Права имею»`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#11142a">
      <h1 style="font-family:Georgia,serif;color:#11142a;margin:0 0 12px">Сброс пароля</h1>
      <p>Здравствуйте, <b>${name}</b>!</p>
      <p>Вы запросили сброс пароля на портале <b>«Права имею»</b>. Нажмите кнопку ниже, чтобы задать новый:</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#8a1538;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block">Сбросить пароль</a>
      </p>
      <p style="color:#4d5870;font-size:13px">Или скопируйте ссылку:<br>${link}</p>
      <p style="color:#4d5870;font-size:13px">Ссылка действительна 1 час.</p>
      <hr style="border:none;border-top:1px solid #e8ebf0;margin:24px 0" />
      <p style="color:#9ea8ba;font-size:12px">Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.</p>
    </div>
  `;
  return { text, html };
}

export function buildVerifyEmail(name: string, link: string) {
  const text = `Здравствуйте, ${name}!\n\nВы регистрируетесь на портале «Права имею».\nПодтвердите почту, перейдя по ссылке:\n\n${link}\n\nСсылка действует 24 часа.\nЕсли вы не регистрировались — просто проигнорируйте письмо.\n\n— Команда «Права имею»`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#11142a">
      <h1 style="font-family:Georgia,serif;color:#11142a;margin:0 0 12px">Здравствуйте, ${name}!</h1>
      <p>Вы регистрируетесь на портале <b>«Права имею»</b>. Подтвердите почту, чтобы активировать аккаунт:</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#8a1538;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;display:inline-block">Подтвердить почту</a>
      </p>
      <p style="color:#4d5870;font-size:13px">Или скопируйте ссылку: <br>${link}</p>
      <p style="color:#4d5870;font-size:13px">Ссылка действительна 24 часа.</p>
      <hr style="border:none;border-top:1px solid #e8ebf0;margin:24px 0" />
      <p style="color:#9ea8ba;font-size:12px">Если вы не регистрировались на «Права имею» — просто проигнорируйте это письмо.</p>
    </div>
  `;
  return { text, html };
}
