/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#050505',
                'neon-red': '#ff2a6d',
                'cyber-gold': '#ffd700',
                'hologram-blue': '#05d9e8',
                'midnight-blue': '#020024',
            },
            fontFamily: {
                'oswald': ['"Oswald"', 'sans-serif'],
                'zen': ['"Zen Dots"', 'cursive'],
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #05d9e8' },
                    '50%': { opacity: '0.5', boxShadow: '0 0 10px #05d9e8' },
                }
            }
        },
    },
    plugins: [],
}
