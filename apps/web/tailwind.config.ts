import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        cream: "var(--color-cream)",
        card: "var(--color-card)",
        line: "var(--color-line)"
      },
      boxShadow: {
        card: "0 24px 80px rgba(0, 0, 0, 0.24)"
      },
      borderRadius: {
        card: "28px"
      }
    }
  },
  plugins: []
};

export default config;
