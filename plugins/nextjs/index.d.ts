import z from 'zod'
import { optionsSchema } from './src/utils'

export type Plugin = {
  apply(compiler: any)
  new (options?: z.infer<typeof optionsSchema>): Plugin
}

import { getRoutes, patterns } from '@generouted/core'
export type GetRoutes = typeof getRoutes
export type Patterns = typeof patterns
