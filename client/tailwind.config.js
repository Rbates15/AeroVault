/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        av: {
          bg:             '#080d1a',   // page background — deep navy-black
          surface:        '#0f1629',   // card and modal backgrounds
          'surface-alt':  '#162033',   // slightly lighter surface for hover/nested cards
          border:         '#1e2d4a',   // subtle borders
          accent:         '#3b82f6',   // blue-500 — primary CTA
          'accent-hover': '#2563eb',   // blue-600 — hover state
          'accent-muted': '#1d4ed8',   // blue-700 — pressed/active
          text:           '#f1f5f9',   // primary white text
          muted:          '#64748b',   // secondary/placeholder text
          subtle:         '#334155',   // dividers, disabled states
          success:        '#10b981',   // green-500 — confirmed/low impact
          warning:        '#f59e0b',   // amber-500 — moderate impact
          danger:         '#ef4444',   // red-500 — high impact / errors
          // Trip Impact scale
          'impact-low':      '#22c55e',
          'impact-moderate': '#f59e0b',
          'impact-high':     '#f97316',
          'impact-very-high':'#ef4444',
        },
      },
      fontFamily: {
        // System font stack — no external CDN required
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          '"Cascadia Code"',
          '"Fira Code"',
          '"Courier New"',
          'monospace',
        ],
      },
      backgroundImage: {
        // Hero gradient
        'hero-gradient': 'linear-gradient(135deg, #080d1a 0%, #0f1d3a 50%, #080d1a 100%)',
        // Accent gradient for CTAs
        'accent-gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        // Card shimmer
        'card-gradient': 'linear-gradient(180deg, #0f1629 0%, #0d1525 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,45,74,0.6)',
        'card-hover': '0 4px 20px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.3)',
        'modal': '0 25px 60px rgba(0,0,0,0.7)',
        'btn': '0 2px 8px rgba(59,130,246,0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
