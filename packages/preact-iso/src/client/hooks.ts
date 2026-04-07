import { useCallback } from 'preact/hooks'
import { useLocation, useRoute } from 'preact-iso'
import { NavigateOptions, To } from './types'

export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  return {
    useParams: <P extends keyof Params>(path: P) => {
      const route = useRoute()
      return route.params as Params[P]
    },
    
    useNavigate: () => {
      const { route } = useLocation()

      return useCallback(
        <P extends Path | To<Path> | number>(to: P, ...[options]: NavigateOptions<P, Params>) => {
          if (typeof to === 'number') {
            // For numeric navigation (history back/forward), preact-iso doesn't support this directly
            // but we can use the browser history API
            window.history.go(to)
            return
          }
          
          const buildPath = (path: any): string => {
            if (typeof path === 'string') {
              return options?.params ? 
                path.replace(/:([^/]+)/g, (_: string, key: string) => (options.params as any)[key] || `:${key}`) : 
                path
            }
            const pathname = options?.params ? 
              path.pathname.replace(/:([^/]+)/g, (_: string, key: string) => (options.params as any)[key] || `:${key}`) : 
              path.pathname
            const search = path.search ? `?${path.search}` : ''
            const hash = path.hash ? `#${path.hash}` : ''
            return `${pathname}${search}${hash}`
          }

          if (typeof route === 'function') {
            route(buildPath(to), options?.replace)
          }
        },
        [route]
      )
    },

    // Modal functionality is limited in preact-iso compared to react-router
    // This is a simplified implementation
    useModals: () => {
      const { route, query } = useLocation()
      
      return {
        current: query.modal || '',
        open: <P extends Path>(path: ModalPath, options?: { at?: P; params?: any; replace?: boolean }) => {
          const currentUrl = new URL(window.location.href)
          currentUrl.searchParams.set('modal', path)
          if (typeof route === 'function') {
            route(currentUrl.pathname + currentUrl.search, options?.replace)
          }
        },
        close: <P extends Path>(options?: { at?: P; params?: any; replace?: boolean }) => {
          const currentUrl = new URL(window.location.href)
          currentUrl.searchParams.delete('modal')
          if (typeof route === 'function') {
            route(options?.at || currentUrl.pathname + currentUrl.search, options?.replace)
          }
        },
      }
    },
  }
} 