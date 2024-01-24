/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts,md}"],
  theme: {
    fontFamily: {
      display: ["Rye"],
      accent: ["Contrail One"],
      body: ["Quicksand"],
      mono: ["JetBrains Mono"],
    },
    extend: {
      colors: {
        green: "#45FFCA",
        yellow: "#FEFFAC",
        pink: "#FFB6D9",
        purple: "#D67BFF",
      },
      scale: {
        250: "2.5",
      },
      animation: {
        "horizontal-scroll": "horizontal-scroll 30s linear infinite",
      },
      keyframes: {
        "horizontal-scroll": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform:
              // 328px (320 + 8 gap) * n cards
              "translateX(-3280px)",
          },
        },
      },
    },
  },
  plugins: [],
};
