export type Options = {
  source: { routes: string | string[]; modals: string | string[] }
  output: string
}

export const defaultOptions: Options = {
  source: { routes: './src/pages/**/[\\w[-]*.{jsx,tsx}', modals: './src/pages/**/[+]*.{jsx,tsx}' },
  output: './src/router.ts',
}
