/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      keyframes: {
        'emoji-fire': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        'emoji-cold': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        'emoji-love': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        fire: {
          '0%, 100%': { boxShadow: '0 0 8px #f97316, 0 0 16px #ea580c', opacity: '1' },
          '50%': { boxShadow: '0 0 12px #f97316, 0 0 24px #ea580c, 0 0 32px #dc2626', opacity: '0.95' },
        },
        cold: {
          '0%, 100%': { boxShadow: '0 0 8px #22d3ee, 0 0 16px #06b6d4', opacity: '1' },
          '50%': { boxShadow: '0 0 12px #22d3ee, 0 0 24px #06b6d4, 0 0 32px #0891b2', opacity: '0.95' },
        },
        star: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.9' },
        },
        medal: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-5deg)' },
          '75%': { transform: 'scale(1.1) rotate(5deg)' },
        },
      },
      animation: {
        'emoji-fire': 'emoji-fire 0.8s ease-in-out infinite',
        'emoji-cold': 'emoji-cold 0.8s ease-in-out infinite',
        'emoji-love': 'emoji-love 0.8s ease-in-out infinite',
        fire: 'fire 1.5s ease-in-out infinite',
        cold: 'cold 1.5s ease-in-out infinite',
        star: 'star 1.2s ease-in-out infinite',
        medal: 'medal 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
