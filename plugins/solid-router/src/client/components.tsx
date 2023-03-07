import { A, AnchorProps, Navigate } from '@solidjs/router'

import { generatePath } from './utils'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type Props<P> = AnchorProps & (P extends ParamPath ? { href: P; params: Params[P] } : { href: P; params?: never })

  return {
    A: <P extends Path>({ href, params, ...props }: Props<P>) => {
      return <A {...props} href={params ? generatePath(href, params) : href} />
    },
    Navigate: <P extends Path>({ href, params, ...props }: Props<P>) => {
      return <Navigate {...props} href={params ? generatePath(href, params) : href} />
    },
  }
}
