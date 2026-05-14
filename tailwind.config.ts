import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b8c2",
          400: "#8e8e9e",
          500: "#6b6b7e",
          600: "#525263",
          700: "#3a3a49",
          800: "#222230",
          900: "#0f0f1a",
          950: "#07070e",
        },
        // Главный цвет бренда — глубокий cobalt-blue.
        // Доверие, банковская/маркетплейсная классика, ничего общего с AI-фиолетовым.
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Жёлтое солнце — CTA-цвет, как «Найти» в Озоне.
        sun: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Красный — только для urgent-меток.
        accent: {
          DEFAULT: "#dc2626",
          50:  "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          dark:  "#b91c1c",
          light: "#f87171",
        },
        // Зелёный — успех/trust-индикаторы.
        success: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        // Cobalt оставлен как алиас на случай старых ссылок.
        cobalt: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        gold: {
          DEFAULT: "#a17c3c",
          light:   "#c49b52",
        },
        cream: "#f7f7f9",
      },
      fontFamily: {
        display: ["'Aveline Eleganza'", "Georgia", "serif"],
        serif:   ["Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        // Marketplace-shadows — мягкие, без цветных glow.
        soft:     "0 2px 8px rgba(15,15,26,0.05)",
        card:     "0 1px 2px rgba(15,15,26,0.04), 0 4px 12px rgba(15,15,26,0.06)",
        lift:     "0 4px 10px rgba(15,15,26,0.06), 0 14px 28px rgba(15,15,26,0.10)",
        cta:      "0 6px 16px rgba(245,158,11,0.32), 0 1px 2px rgba(15,15,26,0.06)",
        deep:     "0 2px 4px rgba(15,15,26,0.04), 0 8px 24px rgba(15,15,26,0.08), 0 20px 48px rgba(15,15,26,0.06)",
        gold:     "0 4px 16px rgba(161,124,60,0.20), 0 1px 4px rgba(15,15,26,0.08)",
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
