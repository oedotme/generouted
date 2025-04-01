import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/core.ts', 'src/index*', 'src/client'],
    format: ['cjs','esm'],
    dts: {
      entry: {
        core: './node_modules/generouted/dist/core.d.ts',
        index: './node_modules/generouted/dist/react-router.d.ts',
        'index-lazy': './node_modules/generouted/dist/react-router-lazy.d.ts',
        'client/index': 'src/client/index.ts',
      },
    },
    external: ['react', 'react-router'],
    noExternal: ['generouted'],
    inject: ['./src/react.js'],
  },
  {
    entry: ['src/plugin'],
    outDir: 'dist/plugin',
    format: ['cjs', 'esm'],
    dts: { entry: 'src/plugin/index.ts' },
  },
])
