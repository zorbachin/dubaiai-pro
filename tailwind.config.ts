import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        panel: "#11141b",
        ink: "#e7eaf0",
        muted: "#8a93a6",
        accent: "#7c5cff",
        accent2: "#22d3ee",
        gold: "#e3b341",
        line: "#1f2330"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.04), 0 12px 40px -16px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};

export default config;
