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

// Каждой категории — собственный «маркетплейсный» цветовой акцент.
// Используем встроенные tailwind-палитры (sky/emerald/rose/amber/indigo/red/slate/cyan).
export const CATEGORY_COLOR: Record<string, { icon: string; bg: string; darkBg: string }> = {
  "dtp-i-gibdd":        { icon: "text-sky-700",     bg: "bg-sky-50",     darkBg: "dark:bg-sky-950/50" },
  "trudovye-spory":     { icon: "text-emerald-700", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-950/50" },
  "semya-i-deti":       { icon: "text-rose-700",    bg: "bg-rose-50",    darkBg: "dark:bg-rose-950/50" },
  "prava-potrebitelya": { icon: "text-amber-700",   bg: "bg-amber-50",   darkBg: "dark:bg-amber-950/50" },
  "zhile-i-zhkh":       { icon: "text-indigo-700",  bg: "bg-indigo-50",  darkBg: "dark:bg-indigo-950/50" },
  "krediti-i-dolgi":    { icon: "text-red-700",     bg: "bg-red-50",     darkBg: "dark:bg-red-950/50" },
  "ugolovnoe-pravo":    { icon: "text-slate-700",   bg: "bg-slate-100",  darkBg: "dark:bg-slate-800" },
  "administrativka":    { icon: "text-cyan-700",    bg: "bg-cyan-50",    darkBg: "dark:bg-cyan-950/50" },
  "nasledstvo":         { icon: "text-amber-800",   bg: "bg-amber-50",   darkBg: "dark:bg-amber-950/50" },
  "migraciya":          { icon: "text-sky-700",     bg: "bg-sky-50",     darkBg: "dark:bg-sky-950/50" },
  "armiya-i-priziv":    { icon: "text-emerald-800", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-950/50" },
  "konstituciya-rf":    { icon: "text-indigo-700",  bg: "bg-indigo-50",  darkBg: "dark:bg-indigo-950/50" },
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
