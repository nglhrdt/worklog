/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Complex site-specific row configuration
        'edit-data-grid': '1fr auto 1fr',
      }
    }
  },
  plugins: [],
}