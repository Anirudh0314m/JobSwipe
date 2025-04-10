module.exports = {
    content: ["./src/**/*.{js,jsx}"],
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
          }
        },
        animation: {
          'fade-in-up': 'fade-in-up 0.3s ease-out'
        }
      },
    },
    plugins: [],
  }