export type Options = {
  source: { routes: string | string[]; modals: string | string[] }
  output: string
  format: boolean
}

export const defaultOptions: Options = {
  source: { routes: './src/pages/**/[\\w[-]*.{jsx,tsx}', modals: './src/pages/**/[+]*.{jsx,tsx}' },
  output: './src/router.ts',
  format: true,
}
