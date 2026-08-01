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
          bg:             '#0f2444',   // page background — rich navy blue
          surface:        '#163058',   // card and modal backgrounds — lighter blue
          'surface-alt':  '#1d3d6e',   // hover/nested cards — medium blue
          border:         '#2a508a',   // visible blue borders
          accent:         '#3b9eff',   // bright sky blue — primary CTA
          'accent-hover': '#2288f0',   // slightly deeper on hover
          'accent-muted': '#1a6fd4',   // pressed/active
          text:           '#ffffff',   // pure white primary text
          muted:          '#a8c4e8',   // soft blue-white for secondary text
          subtle:         '#4a6d9c',   // dividers, disabled states
          success:        '#34d399',   // green — confirmed/low impact
          warning:        '#fbbf24',   // amber — moderate impact
          danger:         '#f87171',   // red — errors/high impact
          // Trip Impact scale
          'impact-low':      '#34d399',
          'impact-moderate': '#fbbf24',
          'impact-high':     '#fb923c',
          'impact-very-high':'#f87171',
        },
      },
      fontFamily: {
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
        'hero-gradient': 'linear-gradient(135deg, #0a1d3d 0%, #1a4080 50%, #0a1d3d 100%)',
        'accent-gradient': 'linear-gradient(135deg, #3b9eff 0%, #2288f0 100%)',
        'card-gradient': 'linear-gradient(180deg, #163058 0%, #122848 100%)',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(42,80,138,0.5)',
        'card-hover': '0 4px 20px rgba(59,158,255,0.2), 0 0 0 1px rgba(59,158,255,0.4)',
        'modal':      '0 25px 60px rgba(0,0,0,0.6)',
        'btn':        '0 2px 8px rgba(59,158,255,0.4)',
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
