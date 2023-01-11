import { readFileSync } from 'fs'

export const patterns = {
  route: [/^\.?\/src\/pages\/|^\/pages\/|\.(jsx|tsx)$/g, ''],
  splat: [/\[\.{3}.+\]/, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  slash: [/index|\./g, '/'],
} as Record<string, [RegExp, string]>

const getRouteId = (path: string) => path.replace(...patterns.route).replace(/\W/g, '')

const getRouteExports = (content: string) => ({
  default: /^export\s+default\s/gm.test(content),
  pendingComponent: /^export\s+(const|function)\s+PendingComponent(\s|\()/gm.test(content),
  errorComponent: /^export\s+(const|function)\s+ErrorComponent(\s|\()/gm.test(content),
  loader: /^export\s+(const|function)\s+Loader(\s|\()/gm.test(content),
  action: /^export\s+(const|function)\s+Action(\s|\()/gm.test(content),
})

type BaseRoute = { path?: string; children?: BaseRoute[] } & Record<string, any>
type Exports = Record<string, ReturnType<typeof getRouteExports>>
type Patterns = typeof patterns

export const getRoutes = <T extends BaseRoute>(
  files: string[],
  buildRoute: (key: string, exports: Exports[string]) => T,
  patterns: Patterns
) => {
  const filteredRoutes = files
    .filter((key) => !key.includes('/_') || /(_app|_layout)\.(jsx|tsx)$/.test(key))
    .sort((a, z) => +z.includes('_layout') - +a.includes('_layout'))
    .sort((a, z) => +z.includes('pages/_app') - +a.includes('pages/_app'))

  const ids = filteredRoutes.map((route) => getRouteId(route))
  const exports: Record<string, ReturnType<typeof getRouteExports>> = {}

  const routes = filteredRoutes.reduce<T[]>((routes, key) => {
    const content = readFileSync(key, { encoding: 'utf-8' })
    const id = getRouteId(key)

    exports[id] = getRouteExports(content)
    const route = buildRoute(key, exports[id])

    if (!exports[id].default) return routes
    if (['_app', '404'].includes(id) || ids.includes(id + '_layout')) return routes

    const segments = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .split('/')
      .filter(Boolean)

    segments.reduce((parent, segment, index) => {
      const path = segment.replace(...patterns.slash)
      const root = index === 0
      const leaf = index === segments.length - 1 && segments.length > 1
      const node = !root && !leaf
      const layout = segment === '_layout'
      const insert = /^\w|\//.test(path) ? 'unshift' : 'push'

      if (root) {
        const dynamic = path.startsWith(':') || path === '*'
        if (dynamic) return parent

        const last = segments.length === 1
        if (last) {
          routes.push({ id, pid: 'root', path, ...route })
          return parent
        }
      }

      if (root || node) {
        const current = root ? routes : parent.children
        const found = current?.find((route) => route.path === path)
        const _id = segments.slice(0, index + 1).join('')
        const pid = parent?.id || 'root'

        if (found) found.children ??= []
        else current?.[insert]({ id: _id, pid, path, children: [] })
        return found || (current?.[insert === 'unshift' ? 0 : current.length - 1] as BaseRoute)
      }

      if (layout) {
        const pid = segments.slice(0, index - 1).join('') || 'root'
        return Object.assign(parent, { id, pid, ...route })
      }

      if (leaf) {
        parent?.children?.[insert]({ id, pid: parent?.id || 'root', path, ...route })
      }

      return parent
    }, {} as BaseRoute)

    return routes
  }, [])

  const preserved = { _app: ids.includes('_app'), _404: ids.includes('404') }
  const count = ids.length - Object.values(preserved).filter(Boolean).length

  return { routes, preserved, exports, count }
}
