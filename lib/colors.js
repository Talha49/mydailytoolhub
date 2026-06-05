/**
 * Global Color System
 * 
 * This file contains all color definitions for the application.
 * NEVER use hardcoded Tailwind colors like 'bg-blue-500' directly.
 * Always reference colors from this file.
 * 
 * Usage in Tailwind: Configure in tailwind.config.js
 * Usage in JS: import { colors } from '@/lib/colors'
 */

export const colors = {
  // Primary Brand Color
  primary: {
    DEFAULT: '#135bec',
    light: '#4a7ef0',
    dark: '#0d42a8',
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#135bec',
    600: '#0d42a8',
    700: '#0a3380',
  },

  // Background Colors
  background: {
    light: '#f6f6f8',
    dark: '#101622',
    card: {
      light: '#ffffff',
      dark: '#161b2a',
    },
  },

  // Text Colors
  text: {
    primary: {
      light: '#0d121b',
      dark: '#ffffff',
    },
    secondary: {
      light: '#4c669a',
      dark: '#9ca3af',
    },
    muted: {
      light: '#6b7280',
      dark: '#6b7280',
    },
  },

  // Border Colors
  border: {
    light: '#e7ebf3',
    dark: '#2a3142',
    card: {
      light: '#cfd7e7',
      dark: '#374151',
    },
  },

  // Semantic Colors
  success: {
    DEFAULT: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  error: {
    DEFAULT: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    DEFAULT: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  info: {
    DEFAULT: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },

  // Neutral Grays (for general use)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Special Use Cases
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
  backdrop: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(16, 22, 34, 0.8)',
  },
}

/**
 * Helper function to get color value
 * @param {string} path - Dot notation path (e.g., '.DEFAULT', 'text.secondary.light')
 * @returns {string} Color value
 */
export function getColor(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], colors)
}

export default colors
