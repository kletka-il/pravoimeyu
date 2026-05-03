import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import ResendVerifyForm from "./ResendVerifyForm";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) {
    return (
      <Wrap>
        <h1 className="heading-serif text-3xl">Подтверждение почты</h1>
        <p className="text-ink-600 mt-2">
          Перейдите по ссылке из письма, которое мы отправили после регистрации.
          Если письмо не пришло, попробуйте проверить папку «Спам» или
          запросите новое.
        </p>
        <ResendVerifyForm />
      </Wrap>
    );
  }
  const result = await verifyToken(token);
  if (!result.ok) {
    return (
      <Wrap>
        <h1 className="heading-serif text-3xl">Не удалось подтвердить</h1>
        <p className="text-ink-600 mt-2">{result.reason}</p>
        <p className="text-ink-600 mt-4 text-sm">
          Можем отправить новое письмо — введите email, на который
          регистрировались:
        </p>
        <ResendVerifyForm />
        <Link href="/login" className="btn-outline mt-6">
          На страницу входа
        </Link>
      </Wrap>
    );
  }
  return (
    <Wrap>
      <h1 className="heading-serif text-3xl">Почта подтверждена</h1>
      <p className="text-ink-600 mt-2">Теперь вы можете войти в кабинет.</p>
      <Link href="/login?verified=1" className="btn-primary mt-4">
        Войти
      </Link>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-16 max-w-md">
      <div className="card">{children}</div>
    </div>
  );
}
