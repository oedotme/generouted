export const utils = <Path extends string, Params extends Record<string, any>>() => {
  type RedirectOptions<P> = P extends keyof Params ? 
    [{ params: Params[P]; replace?: boolean }] : 
    [{ params?: never; replace?: boolean }] | []

  return {
    redirect: <P extends Path>(url: P, ...[options]: RedirectOptions<P>) => {
      const buildPath = (path: P): string => {
        return options?.params ? 
          path.replace(/:([^/]+)/g, (_: string, key: string) => (options.params as any)[key] || `:${key}`) : 
          path
      }
      
      // In preact-iso, we redirect by programmatically navigating
      // This would typically be used in a useEffect or during routing
      const targetPath = buildPath(url)
      
      if (options?.replace) {
        window.history.replaceState(null, '', targetPath)
      } else {
        window.history.pushState(null, '', targetPath)
      }
      
      // Trigger a popstate event to notify preact-iso of the change
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
      
      return targetPath
    },
  }
} 