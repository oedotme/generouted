export type Options = {
  source: string | string[]
  output: string
}

export const defaultOptions: Options = {
  source: './src/pages/**/[\\w[-]*.{jsx,tsx}',
  output: 'router.ts',
}
