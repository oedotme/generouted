import { Accessor } from 'solid-js'
import { NavigateOptions as NavOptions, useLocation, useMatch, useNavigate, useParams } from '@solidjs/router'
import { MatchFilters } from '@solidjs/router/dist/types'

import { generatePath } from './utils'
import { NavigateOptions } from './types'

export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  return {
    useParams: <P extends keyof Params>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()
      return <P extends Path>(href: P, ...[options]: NavigateOptions<P, Params>) => {
        navigate(options?.params ? generatePath(href, options.params) : href, options)
      }
    },
    useMatch: <P extends Path>(path: () => P, matchFilters?: MatchFilters<P>) => {
      return useMatch(path, matchFilters) as Accessor<{ path: P; params: Params[P] } | undefined>
    },
    useModals: () => {
      const location = useLocation<any>()
      const navigate = useNavigate()

      type Options<P> = Partial<NavOptions<any>> &
        (P extends keyof Params ? { at?: P; params: Params[P] } : { at?: P; params?: never })

      return {
        current: location.state?.modal || '',
        open: <P extends Path>(path: ModalPath, options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          const pathname = options?.params ? generatePath(at || '', options.params || {}) : at
          navigate(pathname || location.pathname, { ...opts, state: { ...location.state, ...state, modal: path } })
        },
        close: <P extends Path>(options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          const pathname = options?.params ? generatePath(at || '', options.params || {}) : at
          navigate(pathname || location.pathname, { ...opts, state: { ...location.state, ...state, modal: '' } })
        },
      }
    },
  }
}
