import { writeFileSync } from 'fs'
import fg from 'fast-glob'

import { patterns as corePatterns, getRoutes } from '@generouted/core'

import { format } from './format'
import { Options } from './options'
import { template } from './template'

const patterns = Object.assign(corePatterns, {
  param: [/\[([^\]]+)\]/g, '$$$1'],
  optional: [/\/-(\$?[\w-]+)/g, '/$1?'],
})

const generateRoutes = async () => {
  const source = ['./src/pages/**/[\\w[-]*.{jsx,tsx}']
  const files = await fg(source, { onlyFiles: true })

  const imports: string[] = []
  const modules: string[] = []
  const actions: Record<'id' | 'export', string>[] = []
  const loaders: Record<'id' | 'export', string>[] = []

  const { routes, preserved, exports, count } = getRoutes(
    files,
    (key, exports, id = '') => {
      const { loader, action, pending, catch_ } = exports
      const module = `import('./pages/${key.replace(...patterns.route)}')`

      if (action) {
        actions.push({
          id,
          export: `const ${id}Action = new Action({ key: '${id}', action: (...args) => ${module}.then((m) => m.Action.apply(m.Action, args as any)) })`,
        })
      }

      if (loader) {
        loaders.push({
          id,
          export: `const ${id}Loader = new Loader({ key: '${id}', loader: (...args) => ${module}.then((m) => m.Loader.apply(m.Loader, args as any)) })`,
        })
      }

      return {
        _component: `lazy(() => ${module})`,
        _pendingComponent: pending ? `lazy(() => ${module}.then((m) => ({ default: m.Pending })))` : '',
        _errorComponent: catch_ ? `lazy(() => ${module}.then((m) => ({ default: m.Catch })))` : '',
      }
    },
    patterns
  )

  if (preserved._app && exports['_app'].default) {
    imports.push(`import App from './pages/_app'`)
    modules.push(`const root = new RootRoute({ component: App || Outlet })`)
  } else {
    modules.push(`const root = new RootRoute({ component: Outlet })`)
  }

  if (preserved._404 && exports['404'].default) {
    imports.push(`import NoMatch from './pages/404'`)
    modules.push(`const _404 = new Route({ getParentRoute: () => root, path: '*', component: NoMatch || Fragment })`)
  } else {
    modules.push(`const _404 = new Route({ getParentRoute: () => root, path: '*', component:  Fragment })`)
  }

  const config = JSON.stringify(routes, function (key, value) {
    if (key === 'id') {
      const { id, pid, path, ...properties } = this

      const options = Object.entries(properties)
        .filter(([key, value]) => key.startsWith('_') && Boolean(value))
        .map(([key, value]) => `${key.replace('_', '')}: ${value}`)

      const props = [path ? `path: '${path}'` : `id: '${id}'`, ...options].filter(Boolean)
      modules.push(`const ${id} = new Route({ getParentRoute: () => ${pid}, ${props.join(', ')} })`)
    }

    if (['pid', 'path'].includes(key) || key.startsWith('_')) return undefined
    return value
  })
    .replace(/"id":"(\w+)"/g, '$1')
    .replace(/^\[|\]$|{|}/g, '')
    .replace(/\[/g, '([')
    .replace(/\]/g, '])')
    .replace(/,"children":/g, '.addChildren')
    .replace(/\),/g, '),\n  ')

  const content = template
    .replace('// imports', imports.join('\n'))
    .replace('// modules', modules.join('\n'))
    .replace('// config', config)
    .replace(
      '// actions-imports',
      actions.length ? `\nimport { Action, ActionClient } from '@tanstack/react-actions'` : ''
    )
    .replace('// actions', '\n\n' + actions.map((action) => action.export).join('\n'))
    .replace(
      '// actions-client',
      actions.length
        ? `export const actionClient = new ActionClient({ getActions: () => [${actions
            .map(({ id }) => `${id}Action`)
            .join(', ')}] })`
        : ''
    )
    .replace(
      '// actions-type',
      actions.length
        ? `\n\ndeclare module '@tanstack/react-actions' { \n  interface Register { \n    actionClient: typeof actionClient \n  } \n}`
        : ''
    )
    .replace(
      '// loaders-imports',
      actions.length ? `\nimport { Loader, LoaderClient } from '@tanstack/react-loaders'` : ''
    )
    .replace('// loaders', '\n\n' + loaders.map((loader) => loader.export).join('\n'))
    .replace(
      '// loaders-client',
      actions.length
        ? `export const loaderClient = new LoaderClient({ getLoaders: () => [${loaders
            .map(({ id }) => `${id}Loader`)
            .join(', ')}] })`
        : ''
    )
    .replace(
      '// loaders-type',
      actions.length
        ? `\n\ndeclare module '@tanstack/react-loaders' { \n  interface Register { \n    loaderClient: typeof loaderClient \n  } \n}`
        : ''
    )

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options) => {
  const start = Date.now()
  const { content, count } = await generateRoutes()
  console.log(`${new Date().toLocaleTimeString()} [generouted] ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  writeFileSync(`./src/${options.output}`, content)
  format(`./src/${options.output}`)
}
