const patterns = {
  clean: [/\/src\/pages\/|\.(jsx|tsx)$/g, ''],
  catch: [/\[\.{3}.+\]/, '*'],
  param: [/\[([^\]]+)\]/g, ':$1'],
  index: [/index|\./g, '/'],
} as const

type PreservedKey = '_app' | '404'

export const generatePreservedRoutes = <T,>(routes: Record<string, T | any>): Partial<Record<PreservedKey, T>> => {
  return Object.keys(routes).reduce((result, current) => {
    const path = current.replace(...patterns.clean)
    return { ...result, [path]: routes[current]?.default }
  }, {})
}
