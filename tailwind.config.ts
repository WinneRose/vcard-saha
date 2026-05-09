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
          red: "#E30613",
          redDark: "#B3000F",
          blue: "#0071BC",
          blueDark: "#005A95",
          navy: "#003A70",
          navy2: "#002A55",
          orange: "#F39200",
          orangeDark: "#C76F00",
          sky: "#87CEEB",
          ink: "#003A70",
          mist: "#F5F9FF",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
