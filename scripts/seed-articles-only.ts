import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../src/lib/data/categories";
import { ARTICLES } from "../src/lib/data/articles";

const prisma = new PrismaClient();

async function main() {
  console.log("📚 Обновление статей и категорий (пользователи не затрагиваются)…\n");

  // Upsert категорий
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: {
        title: c.title,
        description: c.description,
        icon: c.icon,
        specializationKey: c.specializationKey,
        order: c.order,
      },
    });
  }
  console.log(`  ✓ Категорий синхронизировано: ${CATEGORIES.length}`);

  // Строим карту slug→id
  const categoriesDb = await prisma.category.findMany();
  const categoryMap = new Map<string, string>();
  for (const c of categoriesDb) categoryMap.set(c.slug, c.id);

  // Первый admin для authorId новых статей
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  let created = 0;
  let updated = 0;

  for (const a of ARTICLES) {
    const categoryId = categoryMap.get(a.categorySlug);
    if (!categoryId) {
      console.warn(`  ! Пропуск: категория "${a.categorySlug}" не найдена (статья ${a.slug})`);
      continue;
    }

    const existing = await prisma.article.findUnique({ where: { slug: a.slug } });

    const data = {
      title: a.title,
      shortAnswer: a.shortAnswer,
      body: a.body,
      keywords: a.keywords,
      lawRefs: a.lawRefs,
      urgency: a.urgency,
      categoryId,
      isPublished: true,
      ...(admin ? { authorId: admin.id } : {}),
    };

    if (existing) {
      await prisma.article.update({ where: { slug: a.slug }, data });
      updated++;
    } else {
      await prisma.article.create({ data: { slug: a.slug, ...data } });
      created++;
    }
  }

  console.log(`  ✓ Статей создано: ${created}`);
  console.log(`  ✓ Статей обновлено: ${updated}`);
  console.log(`\n✅ Готово. Всего статей в файле: ${ARTICLES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
