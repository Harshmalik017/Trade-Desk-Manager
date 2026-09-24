import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5b3fd4',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
