module.exports = {
  './{packages,plugins}/**/*.{ts,tsx}': () => 'pnpm -r type-check',
  '*.{css,html,json,md,mdx,js,jsx,ts,tsx}': 'prettier --write',
}
