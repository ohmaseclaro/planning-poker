module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brown': {
          800: '#5D4037',
        },
      },
      animation: {
        'bounce-in': 'bounceIn 1s ease-out forwards',
        'emoji-travel': 'emojiTravel 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards'
      },
      keyframes: {
        bounceIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px) scale(0.3)'
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(-10px) scale(1.1)'
          },
          '70%': {
            transform: 'translateY(5px) scale(0.9)'
          },
          '100%': {
            transform: 'translateY(0) scale(1)'
          }
        },
        emojiTravel: {
          '0%': {
            opacity: '0.7',
            transform: 'scale(0.5) translate(var(--travel-start-x), var(--travel-start-y))'
          },
          '40%': {
            opacity: '1',
            transform: 'scale(1.3) translate(calc(var(--travel-end-x) * 0.4), calc(var(--travel-end-y) * 0.4 - 30px))'
          },
          '70%': {
            transform: 'scale(1.2) translate(calc(var(--travel-end-x) * 0.7), calc(var(--travel-end-y) * 0.7 - 15px))'
          },
          '85%': {
            transform: 'scale(1.1) translate(calc(var(--travel-end-x) * 0.9), calc(var(--travel-end-y) * 0.9))'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translate(var(--travel-end-x), var(--travel-end-y))'
          }
        }
      }
    },
  },
  plugins: [],
} 