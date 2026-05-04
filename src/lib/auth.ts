import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { ROLE, type Role } from "./constants";
import { sendEmail, buildVerifyEmail } from "./email";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z
    .string()
    .min(8, "Пароль не короче 8 символов")
    .regex(/[A-Za-zА-Яа-я]/, "Должна быть буква")
    .regex(/[0-9]/, "Должна быть цифра"),
  name: z.string().trim().min(2, "Имя слишком короткое"),
  role: z.enum([ROLE.CLIENT, ROLE.SPECIALIST]).default(ROLE.CLIENT),
  phone: z.string().optional(),
  city: z.string().optional(),
  yearsExperience: z.coerce.number().int().min(0).max(70).optional(),
  specializations: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export async function registerUser(input: RegisterInput, baseUrl: string) {
  const exists = await prisma.user.findUnique({
    where: { email: input.email },
    include: { specialist: true },
  });

  if (exists) {
    // Разрешаем переход CLIENT → SPECIALIST если профиля юриста ещё нет
    if (
      input.role === ROLE.SPECIALIST &&
      exists.role === ROLE.CLIENT &&
      !exists.specialist
    ) {
      const passwordOk = await bcrypt.compare(input.password, exists.passwordHash);
      if (!passwordOk) {
        throw new Error(
          "Аккаунт с этой почтой уже существует. Введите верный пароль от него, чтобы перейти к роли юриста.",
        );
      }
      await prisma.$transaction([
        prisma.user.update({
          where: { id: exists.id },
          data: { role: ROLE.SPECIALIST },
        }),
        prisma.specialistProfile.create({
          data: {
            userId: exists.id,
            status: "PENDING",
            yearsExperience: input.yearsExperience ?? 0,
            phone: input.phone ?? "",
            city: input.city ?? "",
            specializations: JSON.stringify(input.specializations ?? []),
          },
        }),
      ]);
      return { userId: exists.id, role: ROLE.SPECIALIST as Role };
    }
    throw new Error("Пользователь с такой почтой уже существует");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const role: Role = input.role;

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role,
      ...(role === ROLE.SPECIALIST
        ? {
            specialist: {
              create: {
                status: "PENDING",
                yearsExperience: input.yearsExperience ?? 0,
                phone: input.phone ?? "",
                city: input.city ?? "",
                specializations: JSON.stringify(input.specializations ?? []),
              },
            },
          }
        : {}),
    },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verifyToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const link = `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;
  const { text, html } = buildVerifyEmail(input.name, link);
  await sendEmail({
    to: input.email,
    subject: "Подтверждение почты — Право имею",
    text,
    html,
  });

  return { userId: user.id, role };
}

export async function resendVerification(email: string, baseUrl: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return { ok: true as const, status: "noop" as const };
  if (user.emailVerified) return { ok: true as const, status: "already_verified" as const };

  await prisma.verifyToken.updateMany({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    data: { expiresAt: new Date() },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verifyToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const link = `${baseUrl.replace(/\/$/, "")}/verify?token=${token}`;
  const { text, html } = buildVerifyEmail(user.name, link);
  await sendEmail({
    to: user.email,
    subject: "Подтверждение почты — Право имею",
    text,
    html,
  });

  return { ok: true as const, status: "sent" as const };
}

export async function verifyToken(token: string) {
  const t = await prisma.verifyToken.findUnique({ where: { token } });
  if (!t) return { ok: false as const, reason: "Токен не найден" };
  if (t.usedAt) return { ok: false as const, reason: "Токен уже использован" };
  if (t.expiresAt < new Date()) return { ok: false as const, reason: "Срок действия истёк" };
  await prisma.$transaction([
    prisma.verifyToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: t.userId }, data: { emailVerified: new Date() } }),
  ]);
  return { ok: true as const, userId: t.userId };
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new Error("Неверная почта или пароль");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Неверная почта или пароль");
  if (!user.emailVerified) {
    throw new Error("Почта не подтверждена. Проверьте письмо.");
  }
  return user;
}
