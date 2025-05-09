/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Josefin Sans", "ui-sans-serif", "system-ui"], // police principale
        comic: ['"Comic Neue"', "sans-serif"],
        patrick: ['"Patrick Hand"', "cursive"],
        fredoka: ["Fredoka", "sans-serif"],
      },
      backgroundImage: {
        /* existant */
        "marine-gradient": "linear-gradient(to bottom, #bfdeed, #ffffff)",

        /* Nouveaux dégradés par rubrique */
        accueil:      "linear-gradient(to bottom, #cdeaf4, #f4f9fb)",
        actualites:   "linear-gradient(to bottom, #cdeaf4, #f4f9fb)",
        livres:       "linear-gradient(to bottom, #fbeacb, #fffdf6)",
        jeux:         "linear-gradient(to bottom, #d6f6dc, #f6fcf7)",
        services:     "linear-gradient(to bottom, #e3e9ff, #f7f8ff)",
        partenaires:  "linear-gradient(to bottom, #ffe1cc, #fff8f5)",
        contact:      "linear-gradient(to bottom, #fff8d6, #ffffff)",
      },
      keyframes: {
        slowSpin:    { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        flyLeft:     { "0%": { transform: "translateX(100vw) translateY(0)" }, "100%": { transform: "translateX(-50vw) translateY(-20vh)" } },
        waves:       { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
        fadeIn:      { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        sunPulse:    { "0%, 100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.2)", opacity: 0.7 } },
        bounceArrow: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        logoPulse:   { "0%, 100%": { transform: "scale(1)", filter: "drop-shadow(0 0 0px rgba(255,255,255,0.5))" }, "50%": { transform: "scale(1.05)", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.6))" } },
        logoGlow:    { "0%, 100%": { filter: "drop-shadow(0 0 10px rgba(0,255,255,0.8))" }, "50%": { filter: "drop-shadow(0 0 30px rgba(0,255,255,1))" } },
      },
      animation: {
        "logo-rotate":  "slowSpin 20s linear infinite",
        "birds-fly":    "flyLeft 20s linear infinite",
        waves:          "waves 3s ease-in-out infinite",
        "fade-in":      "fadeIn 2s ease-in forwards",
        "sun-pulse":    "sunPulse 4s ease-in-out infinite",
        "arrow-bounce": "bounceArrow 2s infinite",
        "logo-pulse":   "logoPulse 3s ease-in-out infinite",
        "logo-glow":    "logoGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};