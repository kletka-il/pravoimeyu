import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "../src/lib/data/categories";
import { ARTICLES } from "../src/lib/data/articles";
import { WINS } from "../src/lib/data/wins";
import { ROLE, SPECIALIST_STATUS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Запуск посевных данных…");

  // Очищаем (порядок важен из-за внешних ключей)
  await prisma.searchLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.win.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.verifyToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.specialistProfile.deleteMany();
  await prisma.user.deleteMany();

  // Категории
  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }
  console.log(`  ✓ Категорий: ${CATEGORIES.length}`);

  // Тестовые пользователи
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@pravoimeyu.local",
      passwordHash,
      name: "Главный модератор",
      role: ROLE.ADMIN,
      emailVerified: new Date(),
    },
  });

  const client = await prisma.user.create({
    data: {
      email: "client@pravoimeyu.local",
      passwordHash,
      name: "Иван Тестов",
      role: ROLE.CLIENT,
      emailVerified: new Date(),
    },
  });

  const specialists = await Promise.all([
    prisma.user.create({
      data: {
        email: "lawyer1@pravoimeyu.local",
        passwordHash,
        name: "Анна Соколова",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.APPROVED,
            yearsExperience: 12,
            bio:
              "Уголовные дела, защита подозреваемых и обвиняемых, обыски, задержания. Член Адвокатской палаты Москвы с 2014 года.",
            city: "Москва",
            phone: "+7 (495) 000-00-01",
            pricePerHour: 8000,
            rating: 4.9,
            reviewsCount: 87,
            specializations: ["criminal", "administrative"],
            credentials: [
              "МГУ им. М.В. Ломоносова, юридический факультет",
              "Адвокатское удостоверение № 77/12345",
              "Стажировка в Институте государства и права РАН",
            ],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "lawyer2@pravoimeyu.local",
        passwordHash,
        name: "Михаил Петров",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.APPROVED,
            yearsExperience: 9,
            bio:
              "ДТП, споры со страховыми, лишения прав. Веду дела от досудебной экспертизы до Верховного суда.",
            city: "Санкт-Петербург",
            phone: "+7 (812) 000-00-02",
            pricePerHour: 5500,
            rating: 4.8,
            reviewsCount: 142,
            specializations: ["traffic", "civil"],
            credentials: [
              "СПбГУ, юридический факультет",
              "Сертификат независимого автоэксперта",
            ],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "lawyer3@pravoimeyu.local",
        passwordHash,
        name: "Екатерина Лисицына",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.APPROVED,
            yearsExperience: 15,
            bio:
              "Семейные дела: разводы, алименты, раздел имущества, споры о детях. Психологическая поддержка клиентов.",
            city: "Москва",
            phone: "+7 (495) 000-00-03",
            pricePerHour: 6500,
            rating: 5.0,
            reviewsCount: 211,
            specializations: ["family", "civil"],
            credentials: [
              "МГЮА им. О.Е. Кутафина",
              "Медиатор (свидетельство № 0023)",
            ],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "lawyer4@pravoimeyu.local",
        passwordHash,
        name: "Дмитрий Воронин",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.APPROVED,
            yearsExperience: 7,
            bio:
              "Трудовые споры: незаконные увольнения, серая зарплата, сокращения, моббинг. Работаю в том числе с коллективными исками.",
            city: "Екатеринбург",
            phone: "+7 (343) 000-00-04",
            pricePerHour: 4000,
            rating: 4.7,
            reviewsCount: 64,
            specializations: ["labor", "civil"],
            credentials: [
              "УрГЮУ",
              "Член профильного комитета по трудовому праву",
            ],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "lawyer5@pravoimeyu.local",
        passwordHash,
        name: "Артём Жуков",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.APPROVED,
            yearsExperience: 11,
            bio:
              "Кредиты, банкротство физлиц, защита от коллекторов. Прошёл более 200 процедур банкротства под ключ.",
            city: "Москва",
            phone: "+7 (495) 000-00-05",
            pricePerHour: 5000,
            rating: 4.9,
            reviewsCount: 178,
            specializations: ["finance", "civil"],
            credentials: [
              "Финансовый университет при Правительстве РФ",
              "Арбитражный управляющий, № в реестре 1234",
            ],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "lawyer6@pravoimeyu.local",
        passwordHash,
        name: "Ольга Тимченко",
        role: ROLE.SPECIALIST,
        emailVerified: new Date(),
        specialist: {
          create: {
            status: SPECIALIST_STATUS.PENDING,
            yearsExperience: 4,
            bio:
              "Защита прав потребителей, споры с интернет-магазинами и маркетплейсами.",
            city: "Краснодар",
            phone: "+7 (861) 000-00-06",
            pricePerHour: 3000,
            rating: 0,
            reviewsCount: 0,
            specializations: ["consumer", "civil"],
            credentials: ["КубГУ"],
          },
        },
      },
    }),
  ]);

  console.log(`  ✓ Пользователей: 1 admin, 1 client, ${specialists.length} specialists`);

  // Статьи
  const categoryMap = new Map<string, string>();
  const categoriesDb = await prisma.category.findMany();
  for (const c of categoriesDb) categoryMap.set(c.slug, c.id);

  for (const a of ARTICLES) {
    const categoryId = categoryMap.get(a.categorySlug);
    if (!categoryId) {
      console.warn(`  ! категория ${a.categorySlug} не найдена для статьи ${a.slug}`);
      continue;
    }
    await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        shortAnswer: a.shortAnswer,
        body: a.body,
        keywords: a.keywords,
        lawRefs: a.lawRefs,
        urgency: a.urgency,
        categoryId,
        authorId: admin.id,
        isPublished: true,
      },
    });
  }
  console.log(`  ✓ Статей: ${ARTICLES.length}`);

  for (const w of WINS) {
    await prisma.win.create({ data: w });
  }
  console.log(`  ✓ Побед: ${WINS.length}`);

  console.log("\n✅ Готово! Тестовые учётки (пароль для всех: Password123!):");
  console.log("   admin@pravoimeyu.local  — администратор");
  console.log("   client@pravoimeyu.local — клиент");
  console.log("   lawyer1..6@pravoimeyu.local — юристы");
  // не показываем client.id чтобы не было unused warnings
  void client;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
