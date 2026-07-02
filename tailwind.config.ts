import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Нейтрали — тёплый графит: светлые тона чуть кремовые, тёмные глубокие.
        ink: {
          50:  "#f7f7f5",
          100: "#ededea",
          200: "#dbdbd7",
          300: "#b9b9b4",
          400: "#8f8f8c",
          500: "#6c6c6a",
          600: "#525252",
          700: "#3b3b3d",
          800: "#232327",
          900: "#131318",
          950: "#0a0a0f",
        },
        // Главный цвет бренда — глубокий сапфир. Дороже и спокойнее кобальта,
        // без AI-фиолетового.
        brand: {
          50:  "#f0f5ff",
          100: "#e0eaff",
          200: "#c3d7fe",
          300: "#95b7fc",
          400: "#5f8ff8",
          500: "#3a6bf2",
          600: "#2450e6",
          700: "#1d40cf",
          800: "#1d37a6",
          900: "#1c3182",
          950: "#141f4d",
        },
        // Тёплое золото — единственный тёплый акцент. Используется дозированно:
        // главный CTA, звёзды рейтинга, серифные акценты.
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
          50:  "#f0f5ff",
          100: "#e0eaff",
          200: "#c3d7fe",
          300: "#95b7fc",
          400: "#5f8ff8",
          500: "#3a6bf2",
          600: "#2450e6",
          700: "#1d40cf",
          800: "#1d37a6",
          900: "#1c3182",
        },
        gold: {
          DEFAULT: "#a17c3c",
          light:   "#c49b52",
        },
        // Тёплая «бумага» — фон светлой темы.
        paper: "#f8f7f4",
        cream: "#f8f7f4",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif:   ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        // Мягкие многослойные тени с лёгким тёплым подтоном.
        soft:  "0 1px 2px rgba(19,19,24,0.04), 0 2px 8px rgba(19,19,24,0.04)",
        card:  "0 1px 2px rgba(19,19,24,0.03), 0 6px 16px rgba(19,19,24,0.05)",
        lift:  "0 2px 6px rgba(19,19,24,0.05), 0 16px 32px rgba(19,19,24,0.10)",
        cta:   "0 8px 20px rgba(29,64,207,0.28), 0 2px 6px rgba(19,19,24,0.08)",
        gold:  "0 8px 20px rgba(245,158,11,0.30), 0 2px 6px rgba(19,19,24,0.08)",
        deep:  "0 2px 4px rgba(19,19,24,0.04), 0 12px 28px rgba(19,19,24,0.08), 0 28px 64px rgba(19,19,24,0.08)",
        ring:  "inset 0 0 0 1px rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-in":  "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "float":    "float 7s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
