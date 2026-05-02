import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О компании — Право имею",
  description: "Реквизиты и информация о портале «Право имею»",
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
          <p className="text-ink-700 leading-relaxed">
            «Право имею» — юридический портал для граждан России, которые оказались
            в сложной жизненной ситуации и не знают, как действовать по закону.
            Мы даём доступ к проверенной правовой информации и связываем пользователей
            с опытными юристами.
          </p>
          <p className="text-ink-700 leading-relaxed">
            Мы убеждены: знание своих прав — это не привилегия, а необходимость
            для каждого гражданина.
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="heading-serif text-2xl">Реквизиты</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-ink-100">
              <tr className="py-2">
                <td className="py-2 text-ink-500 pr-4 w-40">Наименование</td>
                <td className="py-2 font-medium">ООО «Право имею»</td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">ОГРН</td>
                <td className="py-2">[ЗАПОЛНИТЬ]</td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">ИНН</td>
                <td className="py-2">[ЗАПОЛНИТЬ]</td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">КПП</td>
                <td className="py-2">[ЗАПОЛНИТЬ]</td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">Юр. адрес</td>
                <td className="py-2">[ЗАПОЛНИТЬ]</td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">Email</td>
                <td className="py-2">
                  <a href="mailto:info@pravoimeyu.ru" className="text-accent hover:underline">
                    info@pravoimeyu.ru
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-ink-500 pr-4">Телефон</td>
                <td className="py-2">[ЗАПОЛНИТЬ]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card space-y-3">
          <h2 className="heading-serif text-2xl">Контакты</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-ink-500 w-32 shrink-0">Общие вопросы</span>
              <a href="mailto:info@pravoimeyu.ru" className="text-accent hover:underline">
                info@pravoimeyu.ru
              </a>
            </div>
            <div className="flex gap-3">
              <span className="text-ink-500 w-32 shrink-0">Персональные данные</span>
              <a href="mailto:privacy@pravoimeyu.ru" className="text-accent hover:underline">
                privacy@pravoimeyu.ru
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
          <div className="text-sm text-ink-700 space-y-2 leading-relaxed">
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
