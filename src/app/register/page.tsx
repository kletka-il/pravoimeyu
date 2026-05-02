import Link from "next/link";
import RegisterForm from "./RegisterForm";
import { ROLE } from "@/lib/constants";

export const metadata = { title: "Регистрация" };

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role === "SPECIALIST" ? ROLE.SPECIALIST : ROLE.CLIENT;
  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="heading-serif text-3xl mb-2">
        {role === ROLE.SPECIALIST ? "Регистрация юриста" : "Создать аккаунт"}
      </h1>
      <p className="text-ink-500 mb-6">
        {role === ROLE.SPECIALIST
          ? "Заполните данные. После подтверждения почты профиль уйдёт на модерацию администратора."
          : "Регистрация позволяет связаться с юристом, сохранять историю поиска и получать обновления статей."}
      </p>
      <div className="flex gap-2 mb-6">
        <Link
          href="/register"
          className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
            role === ROLE.CLIENT
              ? "bg-accent text-white border-accent"
              : "bg-white border-ink-200 text-ink-700"
          }`}
        >
          Я клиент
        </Link>
        <Link
          href="/register?role=SPECIALIST"
          className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
            role === ROLE.SPECIALIST
              ? "bg-accent text-white border-accent"
              : "bg-white border-ink-200 text-ink-700"
          }`}
        >
          Я юрист
        </Link>
      </div>
      <RegisterForm role={role} />
      <p className="text-sm text-ink-500 mt-6">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Войти
        </Link>
      </p>
    </div>
  );
}
