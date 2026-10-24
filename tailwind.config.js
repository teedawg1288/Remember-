/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fdf8f4',
          100: '#faefe6',
          200: '#f3dec9',
          300: '#ebc5a1',
          400: '#dfa271',
          500: '#d58145',
          600: '#c56837',
          700: '#a3502d',
          800: '#84412a',
          900: '#6c3725',
          950: '#3a1a11',
        },
        lounge: {
          dark: '#0c0e12',
          card: '#161922',
          panel: '#1e222d',
          border: '#2a2f3d',
          accent: '#d58145',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
};
