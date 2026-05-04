export type CategorySeed = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  specializationKey: string;
  order: number;
};

export const SPECIALIZATIONS: Record<string, string> = {
  general: "Общая практика",
  criminal: "Уголовное право",
  administrative: "Административное право",
  civil: "Гражданское право",
  family: "Семейное право",
  labor: "Трудовое право",
  consumer: "Защита прав потребителей",
  housing: "Жилищное право",
  traffic: "ДТП и ГИБДД",
  finance: "Кредиты и долги",
  inheritance: "Наследство",
  migration: "Миграционное право",
};

export const CATEGORIES: CategorySeed[] = [
  {
    slug: "dtp-i-gibdd",
    title: "ДТП и ГИБДД",
    description:
      "Авария, оформление, виновность, страховая, лишение прав, штрафы.",
    icon: "🚗",
    specializationKey: "traffic",
    order: 1,
  },
  {
    slug: "trudovye-spory",
    title: "Работа и трудовые споры",
    description:
      "Увольнение, задержка зарплаты, трудовой договор, отпуск, сокращение.",
    icon: "💼",
    specializationKey: "labor",
    order: 2,
  },
  {
    slug: "semya-i-deti",
    title: "Семья и дети",
    description: "Развод, алименты, раздел имущества, опека, лишение прав.",
    icon: "👨‍👩‍👧",
    specializationKey: "family",
    order: 3,
  },
  {
    slug: "prava-potrebitelya",
    title: "Права потребителя",
    description: "Возврат товара, некачественная услуга, обман в магазине.",
    icon: "🛒",
    specializationKey: "consumer",
    order: 4,
  },
  {
    slug: "zhile-i-zhkh",
    title: "Жильё и ЖКХ",
    description:
      "Соседи, управляющая компания, аренда, выселение, перепланировка.",
    icon: "🏠",
    specializationKey: "housing",
    order: 5,
  },
  {
    slug: "krediti-i-dolgi",
    title: "Кредиты и долги",
    description: "Коллекторы, банкротство, просрочка, поручительство.",
    icon: "💳",
    specializationKey: "finance",
    order: 6,
  },
  {
    slug: "ugolovnoe-pravo",
    title: "Уголовные дела",
    description: "Задержание, обвинение, допрос, обыск, защита подозреваемого.",
    icon: "⚖️",
    specializationKey: "criminal",
    order: 7,
  },
  {
    slug: "administrativka",
    title: "Административные дела",
    description: "Штрафы, протоколы, обжалование постановлений.",
    icon: "📋",
    specializationKey: "administrative",
    order: 8,
  },
  {
    slug: "nasledstvo",
    title: "Наследство",
    description: "Принятие наследства, споры наследников, завещание.",
    icon: "📜",
    specializationKey: "inheritance",
    order: 9,
  },
  {
    slug: "migraciya",
    title: "Миграция и гражданство",
    description: "ВНЖ, РВП, гражданство, депортация, регистрация.",
    icon: "🌍",
    specializationKey: "migration",
    order: 10,
  },
  {
    slug: "armiya-i-priziv",
    title: "Армия и призыв",
    description:
      "Повестка, медкомиссия, отсрочки по здоровью и учёбе, АГС, обжалование решений военкомата.",
    icon: "🪖",
    specializationKey: "general",
    order: 11,
  },
  {
    slug: "konstituciya-rf",
    title: "Конституция и права",
    description:
      "Базовые права граждан по Конституции РФ: молчание, адвокат, жильё, свобода, суд.",
    icon: "📖",
    specializationKey: "general",
    order: 12,
  },
];
