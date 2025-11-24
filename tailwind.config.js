/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0A192F',   // Your primary bg
        'navy-light': '#112240', // Your card/component bg
        'teal-accent': '#64FFDA', // Your primary accent
        'orange-accent': '#FFA500',// Your secondary accent (hotspots)
        'text-primary': '#E6F1FF', // Main text
        'text-secondary': '#8892B0', // Lighter text
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-merriweather)', ...fontFamily.serif],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  // ✅ YE WALI LINE MISSING THI
  plugins: [
    require('@tailwindcss/typography'),
  ],
};