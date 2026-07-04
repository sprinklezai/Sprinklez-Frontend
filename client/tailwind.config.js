/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#173029",
        "sidebar-hover": "#20493d",
        cream: "#f7f5ef",
        card: "#ffffff",
        brand: {
          DEFAULT: "#1f5c47",
          light: "#dbe8e0",
          dark: "#123024",
        },
        accent: "#c17f3e",
        ink: "#1f2a24",
        muted: "#8a948c",
        line: "#e7e3d8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 48, 41, 0.06), 0 1px 8px rgba(23, 48, 41, 0.04)",
      },
    },
  },
  plugins: [],
};
