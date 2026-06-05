import Link from "next/link";
import RegisterForm from "./RegisterForm";
import { ROLE } from "@/lib/constants";

export const metadata = { title: "Регистрация" };

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string; reason?: string };
}) {
  const role = searchParams.role === "SPECIALIST" ? ROLE.SPECIALIST : ROLE.CLIENT;
  const isSearchLimit = searchParams.reason === "limit";
  return (
    <div className="container-page py-12 md:py-16 max-w-2xl">
      <div className="mb-2 inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Регистрация
      </div>
      {isSearchLimit && (
        <div className="mb-4 p-4 bg-sun-50 border border-sun-200 rounded-2xl text-sm text-ink-800">
          Бесплатный запрос использован. Зарегистрируйтесь — это займёт минуту, и поиск станет безлимитным.
        </div>
      )}
      <h1 className="heading-display text-3xl md:text-4xl mb-2">
        {role === ROLE.SPECIALIST ? "Стать юристом" : "Создаём аккаунт"}
      </h1>
      <p className="text-ink-500 mb-6 md:text-lg">
        {role === ROLE.SPECIALIST
          ? "После подтверждения почты профиль уйдёт на модерацию."
          : "Чтобы связаться с юристом, сохранять подсказки и получать обновления."}
      </p>
      <div className="flex gap-2 mb-6 p-1 bg-ink-100 rounded-2xl w-fit">
        <Link
          href="/register"
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            role === ROLE.CLIENT
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-800"
          }`}
        >
          Я клиент
        </Link>
        <Link
          href="/register?role=SPECIALIST"
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            role === ROLE.SPECIALIST
              ? "bg-white text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-800"
          }`}
        >
          Я юрист
        </Link>
      </div>
      <RegisterForm role={role} />
      <p className="text-sm text-ink-500 mt-6 text-center">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
          Войти
        </Link>
      </p>
    </div>
  );
}
