import { useCallback, useMemo } from 'react'
import { generatePath, NavigateOptions as NavOptions, useLocation, useNavigate, useParams } from 'react-router-dom'
import { NavigateOptions, To } from './types'

export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  return {
    useParams: <P extends keyof Params>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()

      return useCallback(
        <P extends Path | To<Path> | number>(to: P, ...[options]: NavigateOptions<P, Params>) => {
          if (typeof to === 'number') return navigate(to)
          const path = generatePath(typeof to === 'string' ? to : to.pathname, options?.params || ({} as any))
          return navigate(typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }, options)
        },
        [navigate],
      )
    },
    useModals: () => {
      const location = useLocation()
      const navigate = useNavigate()

      type Options<P> = NavOptions &
        (P extends keyof Params ? { at?: P; params: Params[P] } : { at?: P; params?: never })

      return useMemo(() => {
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
      }, [location, navigate])
    },
  }
}
