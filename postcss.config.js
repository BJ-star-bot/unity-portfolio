// Tailwind v4 moved its PostCSS plugin to `@tailwindcss/postcss`.
// Since this project currently doesn't rely on Tailwind's PostCSS processing
// (we use plain CSS overrides), keep only Autoprefixer to avoid build errors.
module.exports = {
  plugins: {
    autoprefixer: {},
  },
}
