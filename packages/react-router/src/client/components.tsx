import React from 'react'
import { generatePath, Link, Navigate } from 'react-router-dom'
import { LinkProps, To } from './types'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  return {
    Link: <P extends Path | To<Path>>({ to, params, ...props }: LinkProps<P, Params>) => {
      const path = generatePath(typeof to === 'string' ? to : to.pathname, params || ({} as any))
      return (
        <Link {...props} to={typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }} />
      )
    },
    Navigate: <P extends Path | To<Path>>({ to, params, ...props }: LinkProps<P, Params>) => {
      const path = generatePath(typeof to === 'string' ? to : to.pathname, params || ({} as any))
      return (
        <Navigate
          {...props}
          to={typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }}
        />
      )
    },
  }
}
