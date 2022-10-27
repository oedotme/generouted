const patterns = {
  clean: [/\/src\/pages\/|\.(jsx|tsx)$/g, ''],
  splat: [/\[\.{3}.+\]/, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  index: [/index|\./g, '/'],
} as const

type PreservedKey = '_app' | '404'
type BaseRoute = { path?: string; children?: BaseRoute[] } & Record<string, any>

export const generatePreservedRoutes = <T,>(routes: Record<string, T | any>): Partial<Record<PreservedKey, T>> => {
  return Object.keys(routes).reduce((result, current) => {
    const path = current.replace(...patterns.clean)
    return { ...result, [path]: routes[current]?.default }
  }, {})
}

export const generateRegularRoutes = <T, M>(routes: Record<string, any>, buildRoute: (module: M) => T) => {
  return Object.keys(routes).reduce<BaseRoute[]>((result, current) => {
    const module = routes[current]
    const route = buildRoute(module)

    const segments = current
      .replace(...patterns.clean)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .split('/')
      .filter(Boolean)

    segments.reduce((parent, segment, index) => {
      const path = segment.replace(...patterns.index)
      const root = index === 0
      const leaf = index === segments.length - 1 && segments.length > 1
      const node = !root && !leaf
      const insert = /^\w|\//.test(path) ? 'unshift' : 'push'

      if (root) {
        const dynamic = path.startsWith(':') || path === '*'
        if (dynamic) return parent

        const last = segments.length === 1
        if (last) {
          result.push({ path, ...route })
          return parent
        }
      }

      if (root || node) {
        const current = root ? result : parent.children
        const found = current?.find((route) => route.path === path)
        if (found) found.children ??= []
        else current?.[insert]({ path, children: [] })
        return found || (current?.[insert === 'unshift' ? 0 : current.length - 1] as BaseRoute)
      }

      if (leaf) {
        parent?.children?.[insert]('action' in route && path === '/' ? { index: true, ...route } : { path, ...route })
      }

      return parent
    }, {} as BaseRoute)

    return result
  }, [])
}
