import React, { forwardRef } from 'react'
import { generatePath, Link, Navigate } from 'react-router-dom'
import { LinkProps, To } from './types'

type LinkRef = React.ForwardedRef<HTMLAnchorElement>

export const components = <Path extends string, Params extends Record<string, any>>() => {
  return {
    // @ts-expect-error
    Link: forwardRef(<P extends Path | To<Path>>({ to, params, ...props }: LinkProps<P, Params>, ref: LinkRef) => {
      const path = generatePath(typeof to === 'string' ? to : to.pathname, params || ({} as any))
      return (
        <Link
          ref={ref}
          {...props}
          to={typeof to === 'string' ? path : { pathname: path, search: to.search, hash: to.hash }}
        />
      )
    }),
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
