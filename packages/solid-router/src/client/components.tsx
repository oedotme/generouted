import { A, AnchorProps, Navigate } from '@solidjs/router'

import { generatePath } from './utils'

export const components = <Path extends string, Params extends Record<string, any>>() => {
  type ParamPath = keyof Params
  type Props<P> = AnchorProps & (P extends ParamPath ? { href: P; params: Params[P] } : { href: P; params?: never })

  return {
    A: <P extends Path>(props: Props<P>) => {
      return <A {...props} href={props.params ? generatePath(props.href, props.params) : props.href} />
    },
    Navigate: <P extends Path>(props: Props<P>) => {
      return <Navigate {...props} href={props.params ? generatePath(props.href, props.params) : props.href} />
    },
  }
}
