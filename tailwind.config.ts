import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1e30",
        parchment: "#f6e7c8",
        coral: "#e9785f",
        teal: "#76b8a7",
        gold: "#e0b35a",
        sky: "#91c8e8"
      },
      fontFamily: {
        display: ["'Press Start 2P'", "monospace"],
        body: ["'VT323'", "monospace"]
      },
      boxShadow: {
        pixel: "0 0 0 2px #1a1e30, 6px 6px 0 0 #1a1e30"
      },
      backgroundImage: {
        paper: "radial-gradient(circle at top, rgba(246, 231, 200, 0.2), transparent 55%)"
      }
    }
  },
  plugins: []
};

export default config;
