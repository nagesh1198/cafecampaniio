/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FBF8F3', // Default light background
          200: '#F5EFE6',
          300: '#EFE6D8',
        },
        cafe: {
          50: '#F7F3EF',
          100: '#EDE3D8',
          200: '#DCC7B3',
          300: '#C7A98D',
          400: '#B08968', // Warm brown accent
          500: '#8E6746',
          600: '#6F4E37', // Primary warm café-brown
          700: '#543B29',
          800: '#3D2A1D',
          900: '#261911',
        },
        sage: {
          50: '#F2F7F4',
          100: '#E2EEE5',
          200: '#C6DDCB',
          300: '#A3C8AB',
          400: '#7FA98A', // Fresh sage green CTA / status
          500: '#5D8B69',
          600: '#466F50',
        },
        amber: {
          400: '#F5B041',
          500: '#E8A94C', // Warm amber accent
        },
        crowd: {
          lowBg: '#EAF7EE',
          lowText: '#15803D',
          modBg: '#FEF8E7',
          modText: '#B45309',
          busyBg: '#FDF2F2',
          busyText: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(111, 78, 55, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 30px -4px rgba(111, 78, 55, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
        'lift': '0 14px 38px -4px rgba(111, 78, 55, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
