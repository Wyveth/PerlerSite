import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{html,ts}", // pour standalone + templates HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
