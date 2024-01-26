/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        border:
          '15px 15px 0 hsl(0, 0%, 65%), 30px 30px 0 hsl(75, 4%, 18%), inset 16px 16px 0 hsl(0, 0%, 75%), inset 18px 18px 0 hsl(75, 4%, 65%)',
      },
      colors: {
        blackC: '#2F302C',
        redC: '#DB2A24',
        textC: '#1F201D',
        textCL: '#C1C2BD',
        containerC: '#DCDED3',
      },
    },
  },
  plugins: [],
};
