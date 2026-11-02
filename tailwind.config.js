// Cores apontam para variáveis RGB trocadas por lente em index.css ([data-lens]).
const lens = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        // Palco: tela larga e alta o bastante para cada página caber sem rolar.
        // Abaixo disso (celular, janela baixa) o site volta a rolar normalmente.
        stage: { raw: "(min-width: 1024px) and (min-height: 640px)" },
      },
      colors: {
        abyss: lens("abyss"),
        surface: lens("surface"),
        line: lens("line"),
        metal: lens("metal"),
        accent: lens("accent"),
        ink: lens("ink"),
        dim: lens("dim"),
      },
      fontFamily: {
        display: "var(--font-display)",
        body: ['"IM Fell English"', "Georgia", "serif"],
        sc: ['"IM Fell English SC"', "Georgia", "serif"],
        gothic: ['"UnifrakturMaguntia"', "serif"],
      },
      borderRadius: {
        lens: "var(--corner)",
      },
    },
  },
};
