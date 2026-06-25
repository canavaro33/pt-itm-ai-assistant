import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0A0813',
          light: '#0D0B18',
          medium: '#131127',
          soft: '#1a1730',
        },
        midnight: {
          DEFAULT: '#0A0813',
          light: '#0D0B18',
          card: '#131127',
          surface: '#1a1730',
        },
        navy: {
          DEFAULT: '#1B3A6B',
          light: '#2A5298',
          dark: '#0f2445',
          glow: '#4A7FD4',
        },
        violet: {
          accent: '#8B5CF6',
          glow: '#A78BFA',
          soft: '#2D1B69',
        },
        cyan: {
          accent: '#06B6D4',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          light: '#faf7f2',
          dark: '#e8e0d4',
        },
        purple: {
          accent: '#7F77DD',
        },
        teal: {
          accent: '#1D9E75',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-satoshi)', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(42, 82, 152, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(42, 82, 152, 0.8)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
