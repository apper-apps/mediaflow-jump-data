/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F3F0FF',
          100: '#E8E1FF',
          500: '#5B47E0',
          600: '#4B39C7',
          700: '#3D2FA3'
        },
        accent: {
          500: '#F97316',
          600: '#EA580C'
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'shimmer': {
          '0%': {
            'background-position': '-200px 0'
          },
          '100%': {
            'background-position': 'calc(200px + 100%) 0'
          },
        },
      },
    },
  },
  plugins: [],
}