tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#111111",
        paper: "#f4f1ea",
        mist: "#ebe6dc",
        line: "rgba(17,17,17,0.12)",
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(17,17,17,0.28)",
        lift: "0 12px 40px -18px rgba(17,17,17,0.18)",
      },
    },
  },
};
