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
        muted:   '#64748b',
        // Borders
        border:  '#e2e8f0',
        border2: '#cbd5e1',
        // Legacy aliases (keeps other pages from breaking)
        foam:    '#e03131',
        foam2:   '#c92a2a',
        panel:   '#f8fafc',
        panel2:  '#f1f5f9',
        line:    '#e2e8f0',
        line2:   '#cbd5e1',
        zombie:  '#16a34a',
        danger:  '#dc2626',
        recon:   '#2563eb',
        // keep old ink alias for any references
        'ink-dark': '#0a0a0b',
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'Impact', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
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
