import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primaryFont: ["Salsa", "sans-serif"],
      },
      colors: {
        primaryColor: "#DC143C",
        bgDarkCard: "#1f2937",
        bgDark: "rgb(17, 24, 39)",
        darkHover: "rgb(252 165 165)",
      },
      boxShadow: {
        costum: "2px 2px 6px 0px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
