import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import type { Role } from "./constants";

export type SessionData = {
  userId?: string;
  email?: string;
  name?: string;
  role?: Role;
};

// Fail-fast в production. На этапе сборки (NEXT_PHASE=phase-production-build)
// и в dev-режиме оставляем мягкую проверку при первом запросе.
const SESSION_PASSWORD = process.env.SESSION_PASSWORD;
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  (!SESSION_PASSWORD || SESSION_PASSWORD.length < 32)
) {
  throw new Error(
    "SESSION_PASSWORD не задан или короче 32 символов. Установите переменную окружения перед запуском.",
  );
}

function getSessionOptions(): SessionOptions {
  const sessionPassword = process.env.SESSION_PASSWORD;
  if (!sessionPassword || sessionPassword.length < 32) {
    throw new Error(
      "SESSION_PASSWORD должен быть длиной не менее 32 символов. Проверь переменные окружения.",
    );
  }
  return {
    password: sessionPassword,
    cookieName: "pravoimeyu_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    },
  };
}

export async function getSession() {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

export async function requireSession() {
  const s = await getSession();
  if (!s.userId) throw new Error("UNAUTHORIZED");
  return s;
}

export async function requireRole(role: Role | Role[]) {
  const s = await requireSession();
  const roles = Array.isArray(role) ? role : [role];
  if (!s.role || !roles.includes(s.role)) throw new Error("FORBIDDEN");
  return s;
}
