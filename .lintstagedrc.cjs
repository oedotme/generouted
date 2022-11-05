module.exports = {
  '*.{ts,tsx}': () => 'tsc -p tsconfig.json',
  '*.{css,html,json,md,mdx,js,jsx,ts,tsx}': 'prettier --write',
}
