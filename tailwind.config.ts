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
          navy: "#162246",
          "navy-deep": "#0d1730",
          "navy-light": "#1e3060",
          gold: "#a8843a",
          "gold-light": "#c9a96e",
          "gold-muted": "#d4bc8a",
          blue: "#2251ff",
          dark: "#1a1a1a",
          gray: "#5a5a5a",
          muted: "#999999",
          light: "#e8e8e8",
          offwhite: "#f2f2f2",
          cream: "#faf9f7",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-cormorant)",
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "widest-plus": "0.2em",
        ultra: "0.3em",
      },
      maxWidth: {
        content: "1320px",
      },
    },
  },
  plugins: [],
};
export default config;
