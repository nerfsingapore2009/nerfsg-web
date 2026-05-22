/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:      '#0a0a0b',
        panel:    '#121214',
        panel2:   '#17171a',
        line:     '#26262c',
        line2:    '#2f2f37',
        foam:     '#ed1c24',
        foam2:    '#ff4754',
        foamglow: 'rgba(237,28,36,.35)',
        recon:    '#3ca4ff',
        zombie:   '#94e472',
        danger:   '#ff3d57',
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'Impact', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        foam:  '0 0 0 1px rgba(237,28,36,.4), 0 0 24px rgba(237,28,36,.25)',
        inset: 'inset 0 1px 0 rgba(255,255,255,.04)',
      },
    },
  },
  plugins: [],
}
