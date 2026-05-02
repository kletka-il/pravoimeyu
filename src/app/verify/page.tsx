import Link from "next/link";
import { verifyToken } from "@/lib/auth";

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
        <h1 className="heading-serif text-3xl">Нет токена</h1>
        <p className="text-ink-600 mt-2">
          Перейдите по ссылке из письма. Если ссылка не открывается — повторите
          регистрацию.
        </p>
      </Wrap>
    );
  }
  const result = await verifyToken(token);
  if (!result.ok) {
    return (
      <Wrap>
        <h1 className="heading-serif text-3xl">Не удалось подтвердить</h1>
        <p className="text-ink-600 mt-2">{result.reason}</p>
        <Link href="/login" className="btn-outline mt-4">
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
