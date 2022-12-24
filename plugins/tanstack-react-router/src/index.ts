import { Plugin } from 'vite'

import { generate } from './generate'
import { defaultOptions } from './options'

export default function Generouted(): Plugin {
  const resolvedOptions = Object.assign(defaultOptions, {})

  return {
    name: 'generouted/tanstack-react-router',
    enforce: 'pre',
    configureServer(server) {
      const listener = (path: string) => (path.includes('/src/pages/') ? generate(resolvedOptions) : null)
      server.watcher.on('add', listener)
      server.watcher.on('change', listener)
      server.watcher.on('unlink', listener)
    },
    buildStart() {
      generate(resolvedOptions)
    },
  }
}
