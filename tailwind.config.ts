import type { Config } from "tailwindcss";

// Nordic palette — muted blues, cool neutrals, restrained accents
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4C6A92",
          50: "#EEF2F7",
          100: "#DCE5F0",
          600: "#4C6A92",
          700: "#3E587C",
        },
        positive: {
          DEFAULT: "#4F7A52",
          50: "#EBF1EB",
          600: "#4F7A52",
        },
        canvas: "#F5F7FA",
        ink: "#2E3440",
        muted: "#5B6470",
        sand: "#8F7442",
        danger: "#BF616A",
        cardline: "#E3E8EE",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "var(--font-devanagari)", "sans-serif"],
        body: ["var(--font-inter)", "var(--font-devanagari)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 4px rgba(46,52,64,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
