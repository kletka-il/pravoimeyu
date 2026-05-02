import { PrismaClient } from "@prisma/client";
import { buildIndex, search, suggestSpecializations } from "../src/lib/search/engine";

const prisma = new PrismaClient();

const TEST_QUERIES = [
  "попал в аварию виноват не я что делать",
  "не платят зарплату уже месяц",
  "соседи громко слушают музыку ночью",
  "звонят коллекторы угрожают",
  "магазин не возвращает деньги за бракованный товар",
  "уволили без объяснений",
  "лишают прав за пьянку",
  "хочу подать на развод и алименты",
  "приставы списали все деньги с карты",
  "задержали в отделе полиции что делать",
  "пришёл штраф с камеры можно оспорить",
  "затопили соседи сверху",
  "не пускают в Россию закрыли въезд",
  "как получить наследство от бабушки",
];

async function main() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    include: { category: { select: { slug: true, title: true } } },
  });

  console.log(`Загружено статей: ${articles.length}`);

  buildIndex(
    articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      shortAnswer: a.shortAnswer,
      body: a.body,
      keywords: (a.keywords as string[]) || [],
      category: a.category,
      urgency: a.urgency,
    })),
  );

  let pass = 0;
  let fail = 0;

  for (const q of TEST_QUERIES) {
    const hits = search(q, 3);
    const top = hits[0];
    const ok = !!top;
    if (ok) pass += 1; else fail += 1;
    console.log(`\n  ${q}`);
    if (hits.length === 0) {
      console.log(`    ❌ ничего не найдено`);
    } else {
      hits.forEach((h, i) => {
        console.log(
          `    ${i + 1}. [${h.score.toFixed(2)}] ${h.doc.title}  (${h.doc.category.title})`,
        );
      });
      const specs = suggestSpecializations(hits);
      console.log(`    → специализация: ${specs.slice(0, 2).join(", ")}`);
    }
  }

  console.log(`\nИтого: ${pass}/${TEST_QUERIES.length} запросов с результатами`);

  await prisma.$disconnect();
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
