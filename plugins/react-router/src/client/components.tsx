import React from 'react'
import { generatePath, Link, LinkProps, Navigate } from 'react-router-dom'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type To = { pathname: Path; search?: string; hash?: string }

  type PropsWithParams<P extends Path | To> = LinkProps &
    (P extends ParamPath
      ? { to: P; params: Params[P] }
      : P extends To
      ? P['pathname'] extends ParamPath
        ? { to: P; params: Params[P['pathname']] }
        : { to: P; params?: never }
      : { to: P; params?: never })

  return {
    Link: <P extends Path | To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path = generatePath(typeof to === 'string' ? to : to.pathname, params || {})
      return (
        <Link {...props} to={typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }} />
      )
    },
    Navigate: <P extends Path | To>({ to, params, ...props }: PropsWithParams<P>) => {
      const path = generatePath(typeof to === 'string' ? to : to.pathname, params || {})
      return (
        <Navigate
          {...props}
          to={typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }}
        />
      )
    },
  }
}
