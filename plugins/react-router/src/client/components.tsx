import React from 'react'
import { generatePath, Link, LinkProps, Navigate } from 'react-router-dom'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type To = Path | Partial<{ pathname: Path | string; search: string; hash: string }>

  type PropsWithParams<P> = LinkProps & (P extends ParamPath ? { to: P; params: Params[P] } : { to: P; params?: never })

  return {
    Link: <P extends To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path = typeof to === 'string' ? to : to?.pathname || ''
      return <Link {...props} to={params ? generatePath(path, params || {}) : to} />
    },
    Navigate: <P extends To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path = typeof to === 'string' ? to : to?.pathname || ''
      return <Navigate {...props} to={params ? generatePath(path, params || {}) : to} />
    },
  }
}
