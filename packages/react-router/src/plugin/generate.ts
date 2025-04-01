import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import type {Logger} from 'vite'
import type Webpack from 'webpack'

import { patterns } from '@generouted/core'
import fg from 'fast-glob'


import { Options } from './options'
import { template } from './template'

const generateRouteTypes = async (options: Options) => {
  const files = await fg(options.source.routes || './src/pages/**/[\\w[-]*.{jsx,tsx,mdx}', { onlyFiles: true })
  const modal = await fg(options.source.modals || './src/pages/**/[+]*.{jsx,tsx,mdx}', { onlyFiles: true })

  const filtered = files.filter((key) => !key.includes('/_') && !key.includes('/404'))
  const params: string[] = []

  const paths = filtered.map((key) => {
    const path = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .replace(/\([\w-]+\)\/|\/?_layout/g, '')
      .replace(/\/?index|\./g, '/')
      .replace(/(\w)\/$/g, '$1')
      .split('/')
      .map((segment) => segment.replace(...patterns.optional))
      .join('/')

    if (path) {
      const param = path.split('/').filter((segment) => segment.startsWith(':'))

      if (param.length || path.includes('*')) {
        const dynamic = param.length ? param.map((p) => p.replace(/:(.+)(\?)?/, '$1$2:') + ' string') : []
        const splat = path.includes('*') ? ["'*': string"] : []
        params.push(`'/${path}': { ${[...dynamic, ...splat].join('; ')} }`)
      }

      return path.length > 1 ? `/${path}` : path
    }
  })

  const modals = modal.map(
    (path) =>
      `/${path
        .replace(...patterns.route)
        .replace(/\+|\([\w-]+\)\//g, '')
        .replace(/(\/)?index/g, '')
        .replace(/\./g, '/')}`,
  )

  const types =
    `export type Path =\n  | "${[...new Set(paths.filter(Boolean))].sort().join('"\n  | "')}"`.replace(/"/g, '`') +
    '\n\n' +
    `export type Params = {\n  ${params.sort().join('\n  ')}\n}` +
    '\n\n' +
    `export type ModalPath = "${modals.sort().join('" | "') || 'never'}"`.replace(/"/g, modals.length ? '`' : '')

  const content = template.replace('// types', types)
  const count = paths.length + modals.length

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options, logger: {info: (msg: string) => void}) => {
  const start = Date.now()
  const { content, count } = await generateRouteTypes(options)
  logger.info(`scanned ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  await fs.promises.writeFile(options.output, content)

  if (!options.format) return
  const prettier = path.resolve('./node_modules/.bin/prettier')
  if (fs.existsSync(prettier)) execSync(`${prettier} --write --cache ${options.output}`)
}
