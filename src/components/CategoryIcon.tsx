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
