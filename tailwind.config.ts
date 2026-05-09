import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#0B1B2B",
          navy2: "#14273D",
          navy3: "#1F3556",
          cyan: "#00B5DB",
          cyan2: "#0094B6",
          red: "#E30613",
          ink: "#0F1A2A",
          mist: "#F5F7FA",
        },
      },
    },
  },
  plugins: [],
};

export default config;
