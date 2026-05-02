import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: {
    default: "Право имею — юридическая помощь, когда она нужна срочно",
    template: "%s · Право имею",
  },
  description:
    "Умный поиск по правовой базе, готовые подсказки на жизненные ситуации и проверенные юристы. Бесплатно для общих вопросов, платно для сложных дел.",
  manifest: "/manifest.json",
  applicationName: "Право имею",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Право имею",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#11142a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const sessionInfo = session.userId
    ? { name: session.name ?? null, role: session.role ?? null }
    : null;

  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <Header session={sessionInfo} />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <RegisterSW />
      </body>
    </html>
  );
}
