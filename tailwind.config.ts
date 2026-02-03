import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary blue gradient
        blue: {
          light: '#95D3FF',
          DEFAULT: '#49ACF2',
          dark: '#1589DC',
        },
        // Pink/magenta gradient
        pink: {
          light: '#FF4FDA',
          DEFAULT: '#FF4FDA',
          dark: '#EE01BC',
        },
        // Accent colors
        green: {
          DEFAULT: '#5BD69F',
        },
        red: {
          DEFAULT: '#F07178',
        },
        yellow: {
          DEFAULT: '#E0C145',
        },
        // Dark background gradient
        dark: {
          light: '#111B32',
          DEFAULT: '#0D1526',
          deep: '#070A1B',
        },
        // Multi gradient colors
        multi: {
          blue: '#8ACEFE',
          pink: '#FE49D8',
          yellow: '#FFC440',
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #1589DC 0%, #49ACF2 50%, #95D3FF 100%)',
        'gradient-pink': 'linear-gradient(135deg, #EE01BC 0%, #FF4FDA 100%)',
        'gradient-dark': 'linear-gradient(180deg, #111B32 0%, #070A1B 100%)',
        'gradient-multi': 'linear-gradient(135deg, #8ACEFE 0%, #FE49D8 50%, #FFC440 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
