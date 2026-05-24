import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        liner: {
          blue: '#5B6EF5',
          dark: '#1A1A2E',
        },
        orchpad: {
          bg: '#0F0F1A',
          card: '#1C1C2E',
          border: '#2E2E45',
          accent: '#7C6AF7',
        },
      },
    },
  },
  plugins: [],
};

export default config;
