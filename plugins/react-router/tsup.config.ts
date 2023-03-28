import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index*', 'src/client'],
    format: ['esm'],
    dts: true,
    external: ['react', 'react-router-dom'],
    noExternal: ['generouted'],
    inject: ['./src/react.js'],
  },
  {
    entry: ['src/plugin'],
    outDir: 'dist/plugin',
    format: ['cjs', 'esm'],
    dts: true,
  },
])
