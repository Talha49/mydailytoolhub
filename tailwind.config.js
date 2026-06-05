import colors from './lib/colors.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: colors.primary,
        
        // Background colors
        background: colors.background,
        
        // Text colors
        text: colors.text,
        
        // Border colors
        border: colors.border,
        
        // Semantic colors
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
        
        // Neutral colors
        gray: colors.gray,
        
        // Special use cases
        overlay: colors.overlay,
        backdrop: colors.backdrop,
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
