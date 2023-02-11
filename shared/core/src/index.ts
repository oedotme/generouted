import { readFileSync } from 'fs'

export const patterns = {
  route: [/^\.?\/src\/pages\/|^\/pages\/|\.(jsx|tsx)$/g, ''],
  splat: [/\[\.{3}\w+\]/g, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  slash: [/^index$|\./g, '/'],
  optional: [/^-(:?[\w-]+)/g, '$1?'],
} as Record<string, [RegExp, string]>

const getRouteId = (path: string) => path.replace(...patterns.route).replace(/\W/g, '')

const getRouteExports = (content: string) => ({
  default: /^export\s+default\s/gm.test(content),
  loader: /^export\s+(const|function|let)\s+Loader/gm.test(content),
  action: /^export\s+(const|function|let)\s+Action/gm.test(content),
  pending: /^export\s+(const|function|let)\s+Pending/gm.test(content),
  catch_: /^export\s+(const|function|let)\s+Catch/gm.test(content),
})

type BaseRoute = { id?: string; path?: string; children?: BaseRoute[] } & Record<string, any>
type Exports = Record<string, ReturnType<typeof getRouteExports>>
type Patterns = typeof patterns

export const getRoutes = <T extends BaseRoute>(
  files: string[],
  buildRoute: (key: string, exports: Exports[string], id?: string) => T,
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

    if (!exports[id].default) return routes
    if (['_app', '404'].includes(id) || ids.includes(id + '_layout')) return routes

    const route = buildRoute(key, exports[id], id)
    const segments = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .replace(...patterns.optional)
      .split('/')
      .filter(Boolean)

    segments.reduce((parent, segment, index) => {
      const path = segment.replace(...patterns.slash)
      const root = index === 0
      const leaf = index === segments.length - 1 && segments.length > 1
      const node = !root && !leaf
      const layout = segment === '_layout'
      const group = /\(\w+\)/.test(path)
      const insert = /^\w|\//.test(path) ? 'unshift' : 'push'

      if (root) {
        const last = segments.length === 1
        if (last) {
          routes.push({ id, pid: 'root', path, ...route })
          return parent
        }
      }

      if (root || node) {
        const current = root ? routes : parent.children
        const _id = getRouteId(segments.slice(0, index + 1).join(''))
        const found = current?.find((route) => route.path === path || route.id === _id)
        const pid = parent?.id || 'root'
        const props = group ? {} : { path }

        if (found) found.children ??= []
        else current?.[insert]({ ...props, id: _id, pid, children: [] })
        return found || (current?.[insert === 'unshift' ? 0 : current.length - 1] as BaseRoute)
      }

      if (layout) {
        const pid = segments.slice(0, index - 1).join('') || 'root'
        return Object.assign(parent, { id: parent.id || parent.path, pid, ...route })
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
