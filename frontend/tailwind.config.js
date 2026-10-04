/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        darkCard: '#151c2e',
        darkBorder: '#232e48',
        brandPrimary: '#6366f1',
        brandSecondary: '#06b6d4',
        brandAccent: '#8b5cf6',
        brandSuccess: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
