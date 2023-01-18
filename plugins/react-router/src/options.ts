export const defaultOptions = {
  output: './src/routes.gen.tsx',
  format: true,
} as const

export type Options = typeof defaultOptions
