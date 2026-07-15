/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./features/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#DC2D2A",
        secondary: "#61C2E2",
        accent: "#6E6E6E",
        neutral: "#000000",
        "base-100": "#F2F2F2",
        "base-200": "#FAFAFB",
        "base-300": "#FFFFFF",
        info: "#5881ff",
        success: "#36d399",
        warning: "#FFDB67",
        error: "#ff8369",
      },
    },
  },
  plugins: [],
}