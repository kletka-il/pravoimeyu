import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Вход" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; verified?: string; registered?: string };
}) {
  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="heading-serif text-3xl mb-2">Войти</h1>
      <p className="text-ink-500 mb-6">
        Доступ к личному кабинету и связи с юристом.
      </p>
      {searchParams.verified === "1" && (
        <div className="mb-4 border-l-4 border-green-500 bg-green-50 px-4 py-3 rounded-r text-sm text-green-900">
          Почта подтверждена. Можно входить.
        </div>
      )}
      {searchParams.registered === "1" && (
        <div className="mb-4 border-l-4 border-sky-500 bg-sky-50 px-4 py-3 rounded-r text-sm text-ink-800">
          Регистрация прошла. На вашу почту отправлено письмо для подтверждения.
        </div>
      )}
      <LoginForm next={searchParams.next} />
      <p className="text-sm text-ink-500 mt-6">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-accent underline underline-offset-2">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
