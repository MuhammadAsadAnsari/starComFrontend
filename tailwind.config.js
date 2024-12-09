/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xx: ["6px", "12px"],

      ss: ["7px", "12px"],
      s: ["10px", "14px"],
      m: ["12px", "16px"],
      lg: ["14px", "20px"],
      ll: ["14px", "22px"],
      l: ["16px", "24px"],
      xl: ["18px", "24px"],
    },
    extend: {
      screens: {
        s: "375px",
        ss: "550px",
        l: "768px",
        lg: "992px",

        xl: "1024px",
        xxl: "1280px",
        "2xl": "1391px",
        "3xl": "1738px",
        "4xl": "1920px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

