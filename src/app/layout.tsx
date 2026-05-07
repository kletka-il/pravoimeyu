import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";
import RegisterSW from "@/components/RegisterSW";

const BASE_URL = "https://pravaimeu.ru";
const DEFAULT_TITLE = "Права имею — юридическая помощь, когда она нужна срочно";
const DEFAULT_DESC =
  "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Права имею",
  },
  description: DEFAULT_DESC,
  keywords: [
    "юридическая помощь",
    "бесплатная консультация юриста",
    "правовая помощь онлайн",
    "юрист онлайн",
    "правовые ситуации",
    "юридические вопросы",
    "права имею",
  ],
  authors: [{ name: "Права имею", url: BASE_URL }],
  creator: "Права имею",
  publisher: "Права имею",
  manifest: "/manifest.json",
  applicationName: "Права имею",
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: BASE_URL,
    siteName: "Права имею",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Права имею",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: ["/icon"],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const sessionInfo = session.userId
    ? { name: session.name ?? null, role: session.role ?? null }
    : null;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-ink-950 text-ink-900 dark:text-white transition-colors">
        <Header session={sessionInfo} />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <RegisterSW />
      </body>
    </html>
  );
}
