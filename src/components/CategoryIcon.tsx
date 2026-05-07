import {
  Car, Briefcase, Users, ShoppingBag, Home,
  CreditCard, Scale, FileText, ScrollText,
  Globe, Shield, BookOpen, type LucideProps,
} from "lucide-react";

const MAP: Record<string, React.FC<LucideProps>> = {
  "dtp-i-gibdd":        Car,
  "trudovye-spory":     Briefcase,
  "semya-i-deti":       Users,
  "prava-potrebitelya": ShoppingBag,
  "zhile-i-zhkh":       Home,
  "krediti-i-dolgi":    CreditCard,
  "ugolovnoe-pravo":    Scale,
  "administrativka":    FileText,
  "nasledstvo":         ScrollText,
  "migraciya":          Globe,
  "armiya-i-priziv":    Shield,
  "konstituciya-rf":    BookOpen,
};

// Цвет иконки и фона для каждой категории
export const CATEGORY_COLOR: Record<string, { icon: string; bg: string; darkBg: string }> = {
  "dtp-i-gibdd":        { icon: "text-cobalt-600",  bg: "bg-cobalt-50",  darkBg: "dark:bg-cobalt-950" },
  "trudovye-spory":     { icon: "text-brand-600",   bg: "bg-brand-50",   darkBg: "dark:bg-brand-950" },
  "semya-i-deti":       { icon: "text-accent-600",  bg: "bg-accent-50",  darkBg: "dark:bg-accent-950/40" },
  "prava-potrebitelya": { icon: "text-cobalt-600",  bg: "bg-cobalt-50",  darkBg: "dark:bg-cobalt-950" },
  "zhile-i-zhkh":       { icon: "text-brand-600",   bg: "bg-brand-50",   darkBg: "dark:bg-brand-950" },
  "krediti-i-dolgi":    { icon: "text-accent-600",  bg: "bg-accent-50",  darkBg: "dark:bg-accent-950/40" },
  "ugolovnoe-pravo":    { icon: "text-ink-600",     bg: "bg-ink-100",    darkBg: "dark:bg-ink-800" },
  "administrativka":    { icon: "text-cobalt-600",  bg: "bg-cobalt-50",  darkBg: "dark:bg-cobalt-950" },
  "nasledstvo":         { icon: "text-brand-600",   bg: "bg-brand-50",   darkBg: "dark:bg-brand-950" },
  "migraciya":          { icon: "text-cobalt-600",  bg: "bg-cobalt-50",  darkBg: "dark:bg-cobalt-950" },
  "armiya-i-priziv":    { icon: "text-accent-600",  bg: "bg-accent-50",  darkBg: "dark:bg-accent-950/40" },
  "konstituciya-rf":    { icon: "text-brand-600",   bg: "bg-brand-50",   darkBg: "dark:bg-brand-950" },
};

export default function CategoryIcon({
  slug,
  size = 20,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[slug] ?? Scale;
  return <Icon size={size} strokeWidth={1.5} className={className} />;
}
