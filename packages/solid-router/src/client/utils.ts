export const generatePath = (path: string, params: Record<string, string>) => {
  return path.replace(/\/:(\w+)(\??)/g, (_, segment) => (params[segment] ? `/${params[segment]}` : ''))
}
