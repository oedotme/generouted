export const template = `// Generouted, changes to this file will be overriden
import { Fragment, lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  generatePath,
  Link as Link_,
  LinkProps as LinkProps_,
  NavigateOptions as NavigateOptions_,
  RouterProvider,
  useNavigate as useNavigate_,
  useParams as useParams_,
} from 'react-router-dom'

// imports

// modules

const config = // config

export const routes = [...config, { path: '*', element: <NoMatch /> }]
const router = createBrowserRouter([{ element: <App />, children: routes }])

// types

type ParamPath = keyof Params
type To = Path | Partial<{ pathname: Path | string; search: string; hash: string }>
type LinkProps<P extends To> = LinkProps_ & { to: P; params?: never }
type LinkPropsWithParams<P extends ParamPath> = LinkProps_ & { to: P; params: Params[P] }
type NavigateOptions = NavigateOptions_ & { params?: never }
type NavigateOptionsWithParams<P extends ParamPath> = NavigateOptions_ & { params: Params[P] }

export const Routes = () => <RouterProvider router={router} />
export const Link = <P extends To>(props: P extends keyof Params ? LinkPropsWithParams<P> : LinkProps<P>) => {
  const { to, params } = props
  return <Link_ {...props} to={params ? generatePath(to, params as any) : to} />
}

export const useParams = <P extends ParamPath>(_path: P) => useParams_<Params[P]>() as Params[P]
export const useNavigate = () => {
  const navigate = useNavigate_()
  return <P extends To>(
    to: P | number,
    options: P extends keyof Params ? NavigateOptionsWithParams<P> : NavigateOptions | null
  ) => navigate(options?.params ? generatePath(to as string, options.params) : (to as any), options as any)
}
`
