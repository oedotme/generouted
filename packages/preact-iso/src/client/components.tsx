import { h } from 'preact'
import { forwardRef } from 'preact/compat'
import { useLocation } from 'preact-iso'
import { LinkProps, To } from './types'

type LinkRef = import('preact').RefObject<HTMLAnchorElement>

export const components = <Path extends string, Params extends Record<string, any>>() => {
  return {
    // @ts-expect-error - Type complexity with forwardRef and generics
    Link: forwardRef(({ to, params, ...props }: LinkProps<Path | To<Path>, Params>, ref: any) => {
      const buildPath = (path: any): string => {
        if (typeof path === 'string') {
          return params ? path.replace(/:([^/]+)/g, (_: string, key: string) => (params as any)[key] || `:${key}`) : path
        }
        const pathname = params ? path.pathname.replace(/:([^/]+)/g, (_: string, key: string) => (params as any)[key] || `:${key}`) : path.pathname
        const search = path.search ? `?${path.search}` : ''
        const hash = path.hash ? `#${path.hash}` : ''
        return `${pathname}${search}${hash}`
      }

      return h('a', {
        ref,
        ...props,
        href: buildPath(to)
      })
    }),

    Navigate: ({ to, params, replace }: LinkProps<Path | To<Path>, Params> & { replace?: boolean }) => {
      const { route } = useLocation()
      
              const buildPath = (path: any): string => {
        if (typeof path === 'string') {
          return params ? path.replace(/:([^/]+)/g, (_: string, key: string) => (params as any)[key] || `:${key}`) : path
        }
        const pathname = params ? path.pathname.replace(/:([^/]+)/g, (_: string, key: string) => (params as any)[key] || `:${key}`) : path.pathname
        const search = path.search ? `?${path.search}` : ''
        const hash = path.hash ? `#${path.hash}` : ''
        return `${pathname}${search}${hash}`
      }

      // Navigate programmatically
      if (typeof route === 'function') {
        route(buildPath(to), replace)
      }

      return null
    },
  }
} 