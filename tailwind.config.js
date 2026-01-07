/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-light": "var(--color-bg-light)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        surface: "var(--color-surface)",
        "surface-light": "var(--color-surface-light)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-lg": "var(--shadow-glow-lg)",
        card: "var(--shadow-card)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
