import { writeFileSync } from 'fs'
import fg from 'fast-glob'

import { patterns } from '@generouted/core'

import { Options } from './options'
import { template } from './template'

const generateRouteTypes = async () => {
  const files = await fg('./src/pages/**/[\\w[-]*.{jsx,tsx}', { onlyFiles: true })
  const modal = await fg('./src/pages/**/[+]*.{jsx,tsx}', { onlyFiles: true })

  const params: string[] = []

  const paths = files.map((key) => {
    const path = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .replace(/\(\w+\)\/|\/?_layout/g, '')
      .replace(/\/?index|\./g, '/')
      .replace(/(\w)\/$/g, '$1')
      .split('/')
      .map((segment) => segment.replace(...patterns.optional))
      .join('/')

    if (['_app', '404'].includes(path)) return

    if (path) {
      const param = path.split('/').filter((segment) => segment.startsWith(':'))

      if (param.length) {
        params.push(`'/${path}': { ${param.map((p) => p.replace(/:(.+)(\?)?/, '$1$2:') + ' string').join('; ')} }`)
      }

      if (path.includes('*')) return '/' + path.replace(/\*/g, '${string}')
      return path.length > 1 ? `/${path}` : path
    }
  })

  const modalPaths = modal.map(
    (path) =>
      `/${path
        .replace(...patterns.route)
        .replace(/\+/g, '')
        .replace(/(\/)?index/g, '')
        .replace(/\./g, '/')}`
  )

  const types =
    `type Path =\n  | "${[...new Set(paths.filter(Boolean))].sort().join('"\n  | "')}"`.replace(/"/g, '`') +
    '\n\n' +
    `type Params = {\n  ${params.sort().join('\n  ')}\n}` +
    '\n\n' +
    `type ModalPath = "${modalPaths.sort().join('" | "') || 'never'}"`.replace(/"/g, modalPaths.length ? '`' : '')

  const content = template.replace('// types', types)
  const count = paths.length + modalPaths.length

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options) => {
  const start = Date.now()
  const { content, count } = await generateRouteTypes()
  console.log(`${new Date().toLocaleTimeString()} [generouted] scanned ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  writeFileSync(`./src/${options.output}`, content)
}
