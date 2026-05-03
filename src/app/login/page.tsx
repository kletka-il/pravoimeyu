import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Вход" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; verified?: string; registered?: string };
}) {
  return (
    <div className="container-page py-12 md:py-16 max-w-md">
      <div className="mb-2 inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Личный кабинет
      </div>
      <h1 className="heading-display text-3xl md:text-4xl mb-2">С возвращением 👋</h1>
      <p className="text-ink-500 mb-6">
        Доступ к кабинету и переписке с юристом.
      </p>
      {searchParams.verified === "1" && (
        <div className="mb-4 bg-mint-50 border border-mint-200 rounded-2xl px-4 py-3 text-sm text-mint-900 flex items-start gap-3">
          <span className="text-lg">✅</span>
          <span>Почта подтверждена. Можно входить.</span>
        </div>
      )}
      {searchParams.registered === "1" && (
        <div className="mb-4 bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 text-sm text-ink-800 flex items-start gap-3">
          <span className="text-lg">📬</span>
          <span>Регистрация прошла! Проверьте почту — там письмо для подтверждения.</span>
        </div>
      )}
      <LoginForm next={searchParams.next} />
      <p className="text-sm text-ink-500 mt-6 text-center">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-brand-600 font-semibold hover:text-brand-700">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
