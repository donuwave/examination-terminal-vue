/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        canvas: '#FAF6F0',
        line: '#EEE8DF',
        ink: { DEFAULT: '#1F2430', soft: '#6B7280' },
        brand: { DEFAULT: '#2F6BFF', soft: '#E6EEFF' },
        pastel: {
          rose: '#FBD3D3',
          peach: '#FBE3B8',
          lavender: '#DCD9F2',
          lime: '#EEF3B8',
          mint: '#CFEBD9',
          sky: '#CFE3F8',
        },
      },
      borderRadius: { card: '20px' },
      boxShadow: { card: '0 1px 2px rgba(31,36,48,.04), 0 4px 16px rgba(31,36,48,.04)' },
    },
  },
  plugins: [],
}
