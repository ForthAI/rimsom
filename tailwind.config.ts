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
          "gold-light": "#c9a84c",
          "gold-dark": "#8a6b2e",
          "gold-muted": "#c4a870",
          blue: "#2251ff",
          "blue-light": "#4a7aff",
          "blue-bright": "#3366ff",
          "blue-vivid": "#0040ff",
          cyan: "#00c2ff",
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
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-slower": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "gradient-x": "gradientX 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
