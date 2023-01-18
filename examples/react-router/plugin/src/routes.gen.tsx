// Generouted, changes to this file will be overriden
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

import app from './pages/_app'
import noMatch from './pages/404'

const Auth = lazy(() => import('./pages/(auth)/_layout'))
const Posts = lazy(() => import('./pages/posts/_layout'))
const About = lazy(() => import('./pages/about'))
const Index = lazy(() => import('./pages/index'))
const IndexError = lazy(() => import('./pages/index').then((m) => ({ default: m.Catch })))
const Authlogin = lazy(() => import('./pages/(auth)/login'))
const Authregister = lazy(() => import('./pages/(auth)/register'))
const Postsiddeep = lazy(() => import('./pages/posts/[id].deep'))
const Postsid = lazy(() => import('./pages/posts/[id]'))
const Postsindex = lazy(() => import('./pages/posts/index'))
const Postsidpid = lazy(() => import('./pages/posts/[id]/-[pid]'))
const App = app || Fragment
const NoMatch = noMatch || Fragment

const config = [
  {
    path: 'posts',
    id: 'posts',
    children: [
      { id: 'postsindex', index: true, element: <Suspense fallback={null} children={<Postsindex />} /> },
      { id: 'postsiddeep', path: ':id/deep', element: <Suspense fallback={null} children={<Postsiddeep />} /> },
      {
        id: 'postsid',
        path: ':id',
        element: <Suspense fallback={null} children={<Postsid />} />,
        children: [
          { id: 'postsidpid', path: ':pid?', element: <Suspense fallback={null} children={<Postsidpid />} /> },
        ],
      },
    ],
    element: <Suspense fallback={null} children={<Posts />} />,
  },
  {
    id: 'auth',
    children: [
      { id: 'authregister', path: 'register', element: <Suspense fallback={null} children={<Authregister />} /> },
      { id: 'authlogin', path: 'login', element: <Suspense fallback={null} children={<Authlogin />} /> },
    ],
    element: <Suspense fallback={null} children={<Auth />} />,
  },
  { id: 'about', path: 'about', element: <Suspense fallback={null} children={<About />} /> },
  {
    id: 'index',
    path: '/',
    element: <Suspense fallback={null} children={<Index />} />,
    loader: (args: any) => import('./pages/index').then((m) => m.Loader.apply(m.Loader, args as any)),
    action: (args: any) => import('./pages/index').then((m) => m.Action.apply(m.Action, args as any)),
    errorElement: <Suspense fallback={null} children={<IndexError />} />,
  },
]

export const routes = [...config, { path: '*', element: <NoMatch /> }]
const router = createBrowserRouter([{ element: <App />, children: routes }])

type Path = '/' | '/about' | '/login' | '/posts' | '/posts/:id' | '/posts/:id/:pid?' | '/posts/:id/deep' | '/register'

type Params = {
  '/posts/:id/deep': { id: string }
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
}

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
