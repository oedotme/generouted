import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import generouted from '@generouted/solid-router/plugin'

export default defineConfig({
  plugins: [solid(), generouted.vite()],
  resolve: { alias: { '@': '/src' } },
})
