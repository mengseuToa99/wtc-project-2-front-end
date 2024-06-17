/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'background': 'var(--background)',
        'primary': 'var(--primary)',
        'second-primary': 'var(--second-primary)',
        'danger': 'var(--danger)',
        'light': 'var(--light)',
        'review': 'var(--review)',
        'pending': 'var(--pending)',
        'completed': 'var(--completed)',
        'deny': 'var(--deny)',
        'accept': 'var(--accept)',
      },
      fontSize: {
        'min': 'clamp(1rem, 2vw, 1.2rem)', // min font size of 1rem, scale with viewport width, max font size of 1.5rem
        'max': 'clamp(1.5rem, 2.5vw, 2rem)', // min font size of 1.5rem, scale with viewport width, max font size of 2rem
      },
    },
  },
  plugins: [require("daisyui")],
};
