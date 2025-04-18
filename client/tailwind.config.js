module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: "#3B82F6",
          secondary: "#10B981",
          dark: "#1F2937",
          light: "#F9FAFB"
        },
        keyframes: {
          'fade-in-up': {
            '0%': {
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            },
          },
          'blob': {
            '0%': {
              transform: 'translate(0px, 0px) scale(1)'
            },
            '33%': {
              transform: 'translate(30px, -50px) scale(1.1)'
            },
            '66%': {
              transform: 'translate(-20px, 20px) scale(0.9)'
            },
            '100%': {
              transform: 'translate(0px, 0px) scale(1)'
            }
          },
          'float': {
            '0%, 100%': { transform: 'translateY(0) rotate(-12deg)' },
            '50%': { transform: 'translateY(-10px) rotate(-12deg)' }
          },
          'float-delayed': {
            '0%, 100%': { transform: 'translateY(0) rotate(12deg)' },
            '50%': { transform: 'translateY(-15px) rotate(12deg)' }
          },
          'shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
          },
          'ping-slow': {
            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.5)', opacity: '0.5' }
          },
          'success': {
            '0%': { opacity: '0', transform: 'scale(0)' },
            '60%': { opacity: '1', transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          },
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.3s ease-out',
          'blob': 'blob 7s infinite',
          'blob-slow': 'blob 10s infinite',
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float-delayed 7s ease-in-out infinite',
          'shake': 'shake 0.6s ease-in-out',
          'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          'success': 'success 0.5s ease-out forwards',
        }
      },
    },
    plugins: [],
  }