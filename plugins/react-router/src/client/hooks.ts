import { generatePath, NavigateOptions, useNavigate, useParams } from 'react-router-dom'

export const hooks = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type To = Path | Partial<{ pathname: Path | string; search: string; hash: string }>

  type NavigateOptionsWithParams<P> = P extends number
    ? []
    : P extends ParamPath
    ? [NavigateOptions & { params: Params[P] }]
    : [NavigateOptions & { params?: never }] | []

  return {
    useParams: <P extends ParamPath>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()
      return <P extends To | number>(to: P, ...[options]: NavigateOptionsWithParams<P>) => {
        if (typeof to === 'number') return navigate(to)
        const path = typeof to === 'string' ? to : to?.pathname || ''
        navigate(options?.params ? generatePath(path, options.params || {}) : to, options)
      }
    },
  }
}
