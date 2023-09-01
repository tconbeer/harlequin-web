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
    },
  },
  plugins: [],
};
