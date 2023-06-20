import { generatePath, NavigateOptions, useLocation, useNavigate, useParams } from 'react-router-dom'

export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  type ParamPath = keyof Params
  type To = { pathname: Path; search?: string; hash?: string }

  type NavigateOptionsWithParams<P extends Path | To | number> = P extends number
    ? []
    : P extends ParamPath
    ? [NavigateOptions & { params: Params[P] }]
    : P extends To
    ? P['pathname'] extends ParamPath
      ? [NavigateOptions & { params: Params[P['pathname']] }]
      : [NavigateOptions & { params?: never }]
    : [NavigateOptions & { params?: never }] | []

  return {
    useParams: <P extends ParamPath>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()
      return <P extends Path | To | number>(to: P, ...[options]: NavigateOptionsWithParams<P>) => {
        if (typeof to === 'number') return navigate(to)
        const path = generatePath(typeof to === 'string' ? to : to.pathname, options?.params || ({} as any))
        navigate(typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }, options)
      }
    },
    useModals: () => {
      const location = useLocation()
      const navigate = useNavigate()

      type Options<P> = NavigateOptions &
        (P extends ParamPath ? { at?: P; params: Params[P] } : { at?: P; params?: never })

      return {
        current: location.state?.modal || '',
        open: <P extends Path>(path: ModalPath, options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: path } })
        },
        close: <P extends Path>(options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: '' } })
        },
      }
    },
  }
}
