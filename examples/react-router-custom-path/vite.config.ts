import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'

export default defineConfig({
  plugins: [
    react(),
    generouted({
      source: { routes: './client/src/pages/**/[\\w[-]*.{jsx,tsx}', modals: './client/src/pages/**/[+]*.{jsx,tsx}' },
      output: './client/src/router.ts',
    }),
  ],
  resolve: { alias: { '@': '/client/src' } },
})
