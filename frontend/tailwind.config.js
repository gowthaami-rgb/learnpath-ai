/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F8FAFC',
        skyblue: {
          DEFAULT: '#E0F2FE',
          dark: '#7DD3FC',
        },
        mint: {
          DEFAULT: '#DCFCE7',
          dark: '#4ADE80',
        },
        lavender: {
          DEFAULT: '#F3E8FF',
          dark: '#C084FC',
        },
        ink: '#1E293B',
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(30, 41, 59, 0.08)',
        softer: '0 2px 12px -2px rgba(30, 41, 59, 0.06)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
