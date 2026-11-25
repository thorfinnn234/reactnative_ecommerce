/** @type {import('tailwindcss').Config} */
module.exports = {
  // Theme tokens (colours, spacing, radius, typography) get defined here in Phase 5.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
