// Generouted, changes to this file will be overriden
import Link from 'next/link'
import { Router, useRouter as _useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { UrlObject } from 'url'

interface TypeSafeUrlObject extends UrlObject {
  pathname?: Path | null | undefined
}
type ValidTypeSafeRoutes = TypeSafeUrlObject | Path

interface TypeSafeRouter extends Router {
  push(url: ValidTypeSafeRoutes, as?: ValidTypeSafeRoutes, options?: Parameters<Router['push']>[2]): Promise<boolean>
}

interface TypeSafeLinkProps extends ComponentProps<typeof Link> {
  href: ValidTypeSafeRoutes
}

export const useInternalRouter = () => _useRouter() as TypeSafeRouter
export const InternalLink = ({ children, ...props }: TypeSafeLinkProps) => <Link {...props}>{children}</Link>

type Path =
  | '/'
  | '/about'
  | '/dashboard'
  | '/explorer/*'
  | '/login'
  | '/posts'
  | '/posts/:id'
  | '/posts/:id/sub'
  | '/register'

type Params = { '/posts/:id': { id: string }; '/posts/:id/sub': { id: string } }
