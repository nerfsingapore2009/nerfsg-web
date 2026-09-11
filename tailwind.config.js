/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        red:     '#e03131',
        red2:    '#c92a2a',
        // Surfaces
        surface: '#f8fafc',
        // Text
        ink:     '#0f172a',
        ink2:    '#0a0f1d',
        // Keep in step with --muted in index.css; see the note there for why
        // this is not #64748b any more.
        muted:   '#5b6879',
        // Borders
        border:  '#e2e8f0',
        border2: '#cbd5e1',
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'Impact', 'system-ui', 'sans-serif'],
        sans:    ['Barlow', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        md:   '0 4px 12px rgba(0,0,0,.08)',
        ring: '0 0 0 3px rgba(224,49,49,.2)',
      },
    },
  },
  plugins: [],
}
