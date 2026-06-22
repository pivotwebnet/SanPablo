/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidad San Pablo (rojo rotisería) — ajustable
        brand: {
          DEFAULT: '#c1272d',
          dark: '#9e1f24',
          light: '#e8534f',
        },
      },
      // Tamaño mínimo cómodo para tocar con el dedo (64px)
      minHeight: {
        touch: '4rem',
      },
    },
  },
  plugins: [],
}
