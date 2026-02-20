/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
  corePlugins: {
    // Avoid collision with Bootstrap's `.collapse` class used by the mobile navbar.
    collapse: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
