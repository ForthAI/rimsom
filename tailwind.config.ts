import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          dark: "#1a1a1a",
          charcoal: "#2a2a2a",
          gray: "#6b6b6b",
          muted: "#999999",
          light: "#e8e8e8",
          offwhite: "#f5f5f3",
          cream: "#faf9f7",
          gold: "#a8843a",
          "gold-light": "#c9a96e",
          navy: "#162246",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "widest-plus": "0.2em",
        "ultra": "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
