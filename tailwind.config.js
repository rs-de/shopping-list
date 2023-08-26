/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [
    require("windy-radix-palette"),
    require("@tailwindcss/typography"),
    require("windy-radix-typography"),
    require("@tailwindcss/forms"),
  ],
  theme: {
    extend: {
      colors: { ...generateAliasForRadixColors("primary", "blue") },
      backgroundImage: { one: "url('/bg1.webp')" },
      minWidth: { 3: "3.5rem" },
      minHeight: { 3: "3rem" },
    },
  },
};

function generateAliasForRadixColors(alias, color) {
  const colors = { [alias]: {} };
  for (let i = 1; i <= 12; i++) {
    colors[alias][i] = `hsl(var(--${color}${i}) / <alpha-value>)`;
  }
  return colors;
}
