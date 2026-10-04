import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF7',
          100: '#FAF7F0', // Primary Warm Ivory token
          200: '#F5EFE3',
          300: '#EDE2D0',
          400: '#E0D0B8',
        },
        cream: {
          50: '#FAF6EE',
          100: '#F8F3E8',
          200: '#F3E8D0', // Primary Warm Cream token
          300: '#E8D7B5',
          400: '#DCC395',
        },
        saffron: {
          50: '#FFF7EB',
          100: '#FEEFD6',
          200: '#FDDCAE',
          300: '#FCC47B',
          400: '#DE7F35',
          500: '#C86B24', // Refined Vedic Saffron
          600: '#B05B1B',
          700: '#944B14',
          800: '#753A0F',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F8D1D8',
          300: '#F1AAB7',
          500: '#A32938',
          600: '#8A202E',
          700: '#741A26',
          800: '#651C24', // Refined Deep Maroon
          850: '#5A1720', // Sacred Primary Deep Maroon
          900: '#4E151B',
          950: '#421218', // Dark Maroon / Garnet
        },
        gold: {
          50: '#FDFBF7',
          100: '#F9F5EA',
          200: '#EADBB5',
          300: '#D8B96A', // Refined Light Gold
          400: '#C7A250',
          500: '#B58A3A', // Refined Antique Gold
          600: '#9C732B',
          700: '#805E21',
          800: '#664917',
        },
        charcoal: {
          700: '#453E38',
          800: '#332D29',
          900: '#24211E', // Refined Charcoal text
          950: '#171513',
        },
        surface: {
          dark: '#321116',
          muted: '#6F625A',
          primary: '#282321',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.58)',
          ivory: 'rgba(250, 247, 240, 0.68)',
          maroon: 'rgba(90, 23, 32, 0.10)',
          dark: 'rgba(50, 17, 22, 0.85)',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif Devanagari"', '"Rozha One"', 'Georgia', 'serif'],
        editorial: ['"Cinzel"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern': "radial-gradient(circle at center, rgba(181, 138, 58, 0.08) 0%, transparent 70%)",
        'spiritual-gold': "linear-gradient(135deg, #B58A3A 0%, #D8B96A 50%, #9C732B 100%)",
        'spiritual-maroon': "linear-gradient(135deg, #421218 0%, #651C24 60%, #4E151B 100%)",
        'ivory-gradient': "linear-gradient(180deg, #FAF7F0 0%, #F3E8D0 100%)",
      },
      boxShadow: {
        'gold-soft': '0 4px 20px -2px rgba(181, 138, 58, 0.20)',
        'gold-glow': '0 0 25px rgba(216, 185, 106, 0.35)',
        'maroon-deep': '0 8px 30px -4px rgba(66, 18, 24, 0.28)',
        'temple-card': '0 4px 24px -2px rgba(36, 33, 30, 0.06), 0 0 0 1px rgba(181, 138, 58, 0.22)',
        'temple-hover': '0 12px 32px -4px rgba(101, 28, 36, 0.16), 0 0 0 1px rgba(181, 138, 58, 0.45)',
      },
      borderRadius: {
        'arch': '999px 999px 1rem 1rem',
        'arch-lg': '12rem 12rem 1.5rem 1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
