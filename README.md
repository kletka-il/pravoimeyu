# Право имею

Юридический помощник для граждан России. Пользователь описывает ситуацию своими словами — портал находит ответ в базе знаний и, если нужно, соединяет с проверенным юристом.

---

## Быстрый старт (локальная разработка, SQLite)

```bash
# 1. Установить зависимости
npm install

# 2. В prisma/schema.prisma поменяй provider на "sqlite":
#    datasource db { provider = "sqlite" ... }

# 3. В .env задай:
#    DATABASE_URL="file:./dev.db"

# 4. Создать БД и заполнить тестовыми данными
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# 5. Запустить dev-сервер
npm run dev
```

Сайт: [http://localhost:3000](http://localhost:3000)

---

## PostgreSQL (production / рекомендуется)

Схема уже настроена под PostgreSQL. Для запуска нужна БД:

| Вариант | Стоимость | Как получить |
|---|---|---|
| **Neon.tech** | Бесплатно (5 ГБ) | [neon.tech](https://neon.tech) → New project → скопировать Connection string |
| **Supabase** | Бесплатно (500 МБ) | [supabase.com](https://supabase.com) → New project → Settings → Database → Connection string |
| Локально | Бесплатно | `brew install postgresql && brew services start postgresql` |

После получения connection string:
```bash
# .env
DATABASE_URL="postgresql://user:password@host:5432/pravoimeyu?sslmode=require"

# Применить миграции
npx prisma migrate deploy

# Заполнить данными
npx tsx prisma/seed.ts
```

---

## Переменные окружения (`.env`)

Скопируй `.env.example` → `.env` и заполни:

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | Строка подключения к БД |
| `SESSION_PASSWORD` | Секрет сессии ≥ 32 символов (обязательно поменять!) |
| `APP_URL` | Базовый URL (для ссылок в письмах) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | SMTP для отправки писем (опционально) |
| `SMTP_FROM` | Адрес отправителя писем |

> Без SMTP — письма сохраняются в `/emails/*.txt` (удобно при разработке).

---

## Тестовые учётные записи

Все пароли: **`Password123!`**

| Роль | Email |
|---|---|
| Администратор | `admin@pravoimeyu.local` |
| Клиент | `client@pravoimeyu.local` |
| Юрист 1–6 | `lawyer1@pravoimeyu.local` … `lawyer6@pravoimeyu.local` |

---

## Команды

```bash
npm run dev                  # dev-сервер
npm run build                # production сборка
npm run start                # запуск production
npx prisma studio            # GUI для БД
npx tsx prisma/seed.ts       # пересеять БД
npx tsx scripts/test-search.ts  # тест поиска (14 запросов)
```

---

## Структура проекта

```
project_pravoimeyu/
├── prisma/
│   ├── schema.prisma       # Схема БД (PostgreSQL, Json-типы)
│   └── seed.ts             # 10 категорий, 28 статей, 13 пользователей
│
├── public/
│   ├── manifest.json       # PWA-манифест
│   ├── sw.js               # Service Worker (офлайн-кэш статей)
│   └── icons/              # Иконки PWA (192x192, 512x512)
│
├── scripts/
│   └── test-search.ts      # Автотест поиска
│
└── src/
    ├── app/
    │   ├── page.tsx                  # Главная страница
    │   ├── about/                    # О компании + реквизиты
    │   ├── privacy/                  # Политика конфиденциальности (152-ФЗ)
    │   ├── search/                   # Поисковая выдача
    │   ├── knowledge/                # База знаний + статья
    │   ├── situations/               # Категории
    │   ├── wins/                     # Победные кейсы
    │   ├── contacts/                 # Форма обратной связи
    │   ├── login/ / register/        # Авторизация
    │   ├── verify/                   # Подтверждение email
    │   ├── offline/                  # Офлайн-заглушка
    │   ├── app/                      # Инструкция по установке PWA
    │   ├── dashboard/
    │   │   ├── client/
    │   │   │   ├── page.tsx          # Главная клиента
    │   │   │   ├── bookings/         # История обращений
    │   │   │   └── profile/          # Редактирование профиля
    │   │   ├── specialist/
    │   │   │   ├── page.tsx          # Профиль + форма редактирования
    │   │   │   └── bookings/         # Входящие обращения
    │   │   └── admin/
    │   │       ├── page.tsx          # Аналитика (9 метрик + 4 графика)
    │   │       ├── specialists/      # Модерация юристов
    │   │       ├── articles/         # CRUD статей
    │   │       └── contacts/         # Обращения с сайта
    │   └── api/
    │       ├── auth/login|register|logout|profile
    │       ├── search/
    │       ├── contacts/
    │       ├── bookings/[id]         # Обновление статуса + email-уведомление
    │       ├── specialist/profile/
    │       └── admin/articles|specialists|contacts
    │
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx                # Реквизиты, ссылки на политику
    │   ├── SearchBar.tsx
    │   └── RegisterSW.tsx
    │
    └── lib/
        ├── prisma.ts
        ├── session.ts                # iron-session
        ├── auth.ts
        ├── email.ts                  # SMTP / файл + шаблоны писем
        ├── markdown.ts
        ├── constants.ts              # ROLE, BOOKING_STATUS, SPECIALIST_STATUS
        ├── data/articles|categories|wins
        └── search/
            ├── stemmer.ts            # Русский алгоритм Портера
            ├── synonyms.ts           # 300+ пар коллоквиальный↔юридический
            ├── engine.ts             # BM25 + веса полей
            └── index.ts              # Кэш индекса (TTL 60 с)
```

---

## Реализованные требования

### Юридическое соответствие
- Страница «Политика конфиденциальности» (`/privacy`) — 152-ФЗ
- Страница «О компании» с реквизитами (`/about`) — заполни ОГРН/ИНН/адрес
- Правовые оговорки: «информация не является консультацией»
- Явное согласие на обработку данных — чекбокс на регистрации и форме контактов
- Ссылки на политику во всех формах и подвале сайта

### Функции личного кабинета
- Регистрация с подтверждением email + авторизация
- Редактирование профиля клиента (имя, телефон, адрес)
- История и статус обращений к юристам
- Юрист редактирует профиль, управляет обращениями
- Email-уведомления при изменении статуса обращения
- Административная панель с 9 метриками, топом статей и запросов

### Функции сайта
- Умный поиск: синонимы + BM25 + стемминг (14/14 тестов)
- 28 статей по реальному праву РФ (ссылки на consultant.ru)
- PWA: офлайн-кэш статей, манифест, иконки
- Адаптивный дизайн (мобильный / планшет / десктоп)

---

## Функции, требующие уточнения

Следующие возможности **технически реализуемы**, но требуют ответа на вопросы:

| Функция | Вопрос |
|---|---|
| Двухфакторная аутентификация (2FA) | SMS (нужен провайдер: SMS.ru, СМSC) или TOTP (Google Authenticator, бесплатно)? |
| Онлайн-оплата консультаций | Какой эквайер? YooKassa (популярна в РФ), Тинькофф, другой? |
| Чат клиент ↔ юрист | В рамках обращения или как отдельный раздел? Реалтайм или async? |
| Загрузка документов | Хранить локально на сервере или в S3-совместимом облаке? |
| Электронная подпись | Простая (ПЭП) или квалифицированная (КЭП, Госуслуги)? |
| CRM-интеграция | Нужна ли интеграция с Битрикс24 или другой CRM? |

---

## Как работает поиск

1. **Синонимы** — «выгнали» → добавляет «уволили», «расторжение»
2. **Стемминг** — «алиментов» → корень «алимент» (Портер)
3. **BM25 с весами полей** — заголовок ×4, ключевые слова ×3, краткий ответ ×2.2, тело ×1
4. **Бонус покрытия** — чем больше слов запроса попало — тем выше
5. **Буст срочности** — urgency ≥ 4 → +5% к скору

Тест: `npx tsx scripts/test-search.ts` → 14/14

---

## Стек

| | |
|---|---|
| Next.js 14 (App Router) | React Server Components |
| TypeScript strict | Zod (валидация) |
| Tailwind CSS v3 | Cormorant Garamond + Inter |
| Prisma 5 + PostgreSQL | Json-типы для массивов |
| iron-session v8 | bcryptjs |
| nodemailer | PWA (manifest + SW) |
