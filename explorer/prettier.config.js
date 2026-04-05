/** @type {import("prettier").Config} */
export default {
  arrowParens: 'always',
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/main.css',
}
