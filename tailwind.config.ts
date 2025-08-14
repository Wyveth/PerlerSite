import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // pour le mode sombre
  content: [
    './src/**/*.{html,ts}' // pour standalone + templates HTML
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
