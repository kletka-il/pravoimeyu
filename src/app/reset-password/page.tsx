import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = { title: "Сброс пароля" };

type Props = { searchParams: { token?: string } };

export default function ResetPasswordPage({ searchParams }: Props) {
  const token = searchParams.token ?? "";

  return (
    <div className="container-page py-16 max-w-md">
      <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
        Личный кабинет
      </div>
      <h1 className="heading-serif text-4xl mb-2">Новый пароль 🔑</h1>
      <p className="text-ink-500 mb-8">Придумайте надёжный пароль для вашего аккаунта.</p>
      <ResetPasswordForm token={token} />
    </div>
  );
}
