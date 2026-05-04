import ContactForm from "./ContactForm";

export const metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <div className="container-page py-12">
      <h1 className="heading-serif text-4xl md:text-5xl mb-3">Контакты</h1>
      <p className="text-ink-500 max-w-2xl mb-10">
        По общим вопросам, предложениям сотрудничества и обращениям
        специалистов — пишите. Мы отвечаем в течение рабочего дня.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Contact title="Общие вопросы" value="p1ava.imeu@gmail.com" href="mailto:p1ava.imeu@gmail.com" />
          <Contact title="Защита персональных данных" value="p1ava.imeu@gmail.com" href="mailto:p1ava.imeu@gmail.com" />
          <div className="card">
            <h3 className="heading-serif text-xl">Юристам</h3>
            <p className="text-sm text-ink-500 mt-1">
              Хотите подключиться к платформе? Пройдите регистрацию как
              специалист — мы свяжемся для верификации.
            </p>
            <a href="/register?role=SPECIALIST" className="btn-outline mt-3">
              Стать юристом «Право имею»
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

function Contact({ title, value, href }: { title: string; value: string; href?: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-widest text-ink-400">
        {title}
      </div>
      <div className="heading-serif text-xl mt-1">
        {href ? (
          <a href={href} className="text-accent hover:underline">{value}</a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
