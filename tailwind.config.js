/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#070707",
        panel: "#0d0d0e",
        card: "#121214",
        line: "#29292d"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0,0,0,.28)",
        card: "0 16px 40px rgba(0,0,0,.18)"
      }
    }
  },
  plugins: []
};
