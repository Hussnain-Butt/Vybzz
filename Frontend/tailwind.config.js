/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds / Surfaces
        'background-dark': 'rgb(var(--color-background-dark) / <alpha-value>)',
        'surface-1': 'rgb(var(--color-surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--color-surface-3) / <alpha-value>)',

        // Text
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'text-link': 'rgb(var(--color-text-link) / <alpha-value>)',

        // Brand / Accents
        'primary-cyan': 'rgb(var(--color-primary-cyan) / <alpha-value>)',
        'primary-blue': 'rgb(var(--color-primary-blue) / <alpha-value>)',
        'accent-pink': 'rgb(var(--color-accent-pink) / <alpha-value>)',
        'accent-orange': 'rgb(var(--color-accent-orange) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
