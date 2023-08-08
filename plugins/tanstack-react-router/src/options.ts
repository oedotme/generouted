export const defaultOptions = {
  output: './src/routes.gen.tsx',
  source: ['./src/pages/**/[\\w[-]*.{jsx,tsx}'],
  format: true,
}

export type Options = typeof defaultOptions
