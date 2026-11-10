/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coderoom: {
          orange: '#D14509',
          ink: '#2B2118',
          muted: '#6B5E50',
          divider: '#E5E1DB',
          tint: '#FFF3EB',
          hover: '#FFF7F1',
          white: '#FFFFFF',
        },
        ink: '#2B2118',
        muted: '#6B5E50',
        divider: '#E5E1DB',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'heading': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'section': ['20px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
