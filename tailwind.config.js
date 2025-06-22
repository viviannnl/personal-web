module.exports = {
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    theme: {
      extend: {
        animation: {
          glow: 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          glow: {
            '0%': { boxShadow: '0 0 8px rgba(147, 51, 234, 0.6)' },
            '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 1)' },
          },
        },
      },
    },
};
  