import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Вход" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: {
    next?: string;
    verified?: string;
    registered?: string;
    email?: string;
  };
}) {
  const isNewUser = searchParams.registered === "1";
  const isVerified = searchParams.verified === "1";
  const emailFailed = searchParams.email === "failed";

  const heading = isNewUser
    ? "Почти готово! 📬"
    : isVerified
      ? "Почта подтверждена ✅"
      : "Войти в аккаунт 🔑";

  const subtext = isNewUser
    ? "Проверьте почту и перейдите по ссылке — после этого сможете войти."
    : isVerified
      ? "Теперь можно войти в аккаунт."
      : "Доступ к кабинету и переписке с юристом.";

  return (
    <div className="container-page py-12 md:py-16 max-w-md">
      <div className="mb-2 inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Личный кабинет
      </div>
      <h1 className="heading-display text-3xl md:text-4xl mb-2">{heading}</h1>
      <p className="text-ink-500 dark:text-ink-400 mb-6">{subtext}</p>
      {isVerified && (
        <div className="mb-4 bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800 rounded-2xl px-4 py-3 text-sm text-mint-900 dark:text-mint-300 flex items-start gap-3">
          <span className="text-lg">✅</span>
          <span>Почта подтверждена. Можно входить.</span>
        </div>
      )}
      {isNewUser && !emailFailed && (
        <div className="mb-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl px-4 py-3 text-sm text-ink-800 dark:text-sky-200 flex items-start gap-3">
          <span className="text-lg">📬</span>
          <span>
            Регистрация прошла! Письмо для подтверждения отправлено на почту.{" "}
            <strong>Если не видите — проверьте папку «Спам».</strong>
          </span>
        </div>
      )}
      {isNewUser && emailFailed && (
        <div className="mb-4 bg-sun-50 dark:bg-sun-900/20 border border-sun-200 dark:border-sun-800 rounded-2xl px-4 py-3 text-sm text-ink-800 dark:text-sun-200 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>
            Аккаунт создан, но письмо не удалось отправить. Войдите и нажмите «Отправить ещё раз», или обратитесь в поддержку.
          </span>
        </div>
      )}
      <LoginForm next={searchParams.next} />
      <p className="text-sm text-ink-500 dark:text-ink-400 mt-6 text-center">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
