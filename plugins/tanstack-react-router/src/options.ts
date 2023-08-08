export const defaultOptions = {
  output: 'routes.gen.tsx',
  source: ['./src/pages/**/[\\w[-]*.{jsx,tsx}'],
  format: true,
}

export type Options = typeof defaultOptions
