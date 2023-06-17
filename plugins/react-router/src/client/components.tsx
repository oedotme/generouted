import React from 'react'
import { generatePath, Link, LinkProps, Navigate } from 'react-router-dom'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type To = Path | Partial<{ pathname: Path | string; search: string; hash: string }>

  type PropsWithParams<P> = LinkProps & (P extends ParamPath ? { to: P; params: Params[P] } : { to: P; params?: never })

  return {
    Link: <P extends To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path =
        typeof to === 'string'
          ? generatePath(to as string, params || {})
          : {
              pathname: generatePath(to?.pathname || '', params || {}),
              search: to?.search || '',
              hash: to?.hash || '',
            }
      return <Link {...props} to={path} />
    },
    Navigate: <P extends To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path =
        typeof to === 'string'
          ? generatePath(to as string, params || {})
          : {
              pathname: generatePath(to?.pathname || '', params || {}),
              search: to?.search || '',
              hash: to?.hash || '',
            }
      return <Navigate {...props} to={path} />
    },
  }
}
