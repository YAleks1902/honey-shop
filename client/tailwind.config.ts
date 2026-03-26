import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6800',
          DEFAULT: '#F5A623',
          primary: '#F5A623',
        },
        honey: {
          DEFAULT: '#F5A623',
          dark: '#D4890A',
          light: '#FFF3DC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
        screens: { xl: '1200px', '2xl': '1200px' },
      },
    },
  },
  plugins: [],
};

export default config;
