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
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
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
        cream: "#fafaf9",
      },
      fontFamily: {
        display: ["'Aveline Eleganza'", "Georgia", "serif"],
        serif:   ["Georgia", "serif"],
        sans:    ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft:  "0 4px 20px rgba(15, 15, 26, 0.06)",
        card:  "0 1px 2px rgba(15, 15, 26, 0.04), 0 4px 16px rgba(15, 15, 26, 0.06)",
        lift:  "0 10px 30px rgba(124, 58, 237, 0.18), 0 4px 12px rgba(15, 15, 26, 0.06)",
        glow:  "0 0 0 4px rgba(124, 58, 237, 0.18)",
        red:   "0 10px 30px rgba(220, 38, 38, 0.18)",
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
