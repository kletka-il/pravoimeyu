import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f6f8",
          100: "#e8ebf0",
          200: "#cbd2dc",
          300: "#9ea8ba",
          400: "#6e7a90",
          500: "#4d5870",
          600: "#3a4258",
          700: "#2c3349",
          800: "#1d2236",
          900: "#11142a",
          950: "#080a1a",
        },
        accent: {
          DEFAULT: "#8a1538",
          light: "#a83055",
          dark: "#5e0d24",
        },
        gold: {
          DEFAULT: "#b08a3e",
          light: "#cba65a",
        },
        sky: {
          50: "#f0f7fc",
          100: "#dcecf6",
          200: "#bcdcec",
          300: "#8fc6dd",
          400: "#5fa8c8",
          500: "#3d8db4",
          600: "#2e7398",
          700: "#285c7c",
          800: "#234d68",
          900: "#1f4158",
        },
        cream: "#f7f3ec",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(17, 20, 42, 0.06)",
        card: "0 2px 8px rgba(17, 20, 42, 0.05), 0 8px 32px rgba(17, 20, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
