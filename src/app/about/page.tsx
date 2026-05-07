import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О компании — Права имею",
  description: "Реквизиты и информация о портале «Права имею»",
};

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-accent">← Главная</Link>
      </div>

      <h1 className="heading-serif text-4xl mb-10">О компании</h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="card space-y-4">
          <h2 className="heading-serif text-2xl">Миссия</h2>
          <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
            «Права имею» — юридический портал для граждан России, которые оказались
            в сложной жизненной ситуации и не знают, как действовать по закону.
            Мы даём доступ к проверенной правовой информации и связываем пользователей
            с опытными юристами.
          </p>
          <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
            Мы убеждены: знание своих прав — это не привилегия, а необходимость
            для каждого гражданина.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="heading-serif text-2xl">Реквизиты</h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            Полные реквизиты юридического лица будут опубликованы после
            завершения регистрации. По всем официальным запросам пишите на{" "}
            <a href="mailto:p1ava.imeu@gmail.com" className="text-accent hover:underline">
              p1ava.imeu@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="heading-serif text-2xl">Контакты</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-ink-500 w-32 shrink-0">Общие вопросы</span>
              <a href="mailto:p1ava.imeu@gmail.com" className="text-accent hover:underline">
                p1ava.imeu@gmail.com
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-ink-500 w-32 shrink-0">Персональные данные</span>
              <a href="mailto:p1ava.imeu@gmail.com" className="text-accent hover:underline">
                p1ava.imeu@gmail.com
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-ink-500 w-32 shrink-0">Форма связи</span>
              <Link href="/contacts" className="text-accent hover:underline">
                /contacts
              </Link>
            </div>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="heading-serif text-2xl">Правовая оговорка</h2>
          <div className="text-sm text-ink-700 dark:text-ink-300 space-y-2 leading-relaxed">
            <p>
              Информация на данном сайте носит исключительно справочный и общеобразовательный
              характер. Она не является юридической консультацией и не создаёт отношений
              «адвокат — клиент».
            </p>
            <p>
              Для получения профессиональной юридической помощи применительно к конкретной
              ситуации рекомендуем обратиться к специалисту через раздел{" "}
              <Link href="/search" className="text-accent hover:underline">
                «Что мне делать?»
              </Link>
              .
            </p>
            <p>
              Результаты прошлых дел не гарантируют аналогичного исхода в будущих делах.
            </p>
          </div>
        </div>

      </div>

      <div className="mt-10 text-sm text-ink-400">
        Деятельность по подбору специалистов осуществляется на основании законодательства
        об оказании информационных услуг. Непосредственное оказание юридических услуг
        осуществляется специалистами-партнёрами, имеющими соответствующую квалификацию.
      </div>
    </div>
  );
}
