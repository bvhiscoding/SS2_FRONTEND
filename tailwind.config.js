/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#01579B",
        primaryBG: "rgba(225,245,254,0.30)",
        bgGray: "#fafafa",
        textColor: "#003560",
        danger: "#F5222D",
        info: "#1890FF",
        myRed: "#ED1D24",
      },
      boxShadow: {
        'shadow-timeword': '0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20);',
        'shadow-box': '4.0px 8.0px 8.0px rgba(0,0,0,0.38)]'
      },
      backgroundImage: {
        linearBG: "linear-gradient(to right, #d4e8db , #d7e1f3,#f2f5fb)",
        linearBG2: "linear-gradient(to  left, #d4e8db , #d7e1f3,#f2f5fb)",
      },
    },
  },
};
