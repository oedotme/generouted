import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router'

export default defineConfig({
  plugins: [react(), generouted()],
  resolve: { alias: { '@': '/src' } },
})
