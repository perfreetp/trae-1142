/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          deeper: '#060D1F',
          card: '#1E293B',
          'card-hover': '#273549',
          border: '#334155',
          cyan: '#22D3EE',
          green: '#10B981',
          orange: '#F97316',
          red: '#EF4444',
          gray: '#94A3B8',
          'gray-light': '#CBD5E1',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #22D3EE, #10B981)',
        'gradient-brand-hover': 'linear-gradient(135deg, #06B6D4, #059669)',
        'gradient-warm': 'linear-gradient(135deg, #F97316, #EF4444)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
    },
  },
  plugins: [],
};
