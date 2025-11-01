/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vapor: {
          primary: 'var(--vapor-primary)',
          background: 'var(--vapor-background)',
          'background-secondary': 'var(--vapor-background-secondary)',
          text: 'var(--vapor-text)',
          'text-secondary': 'var(--vapor-text-secondary)',
          accent: 'var(--vapor-accent)',
          success: 'var(--vapor-success)',
          error: 'var(--vapor-error)',
          warning: 'var(--vapor-warning)',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
