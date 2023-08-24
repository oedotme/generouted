// Generouted, changes to this file will be overriden
import { Fragment } from 'react'
import { Action, ActionClient } from '@tanstack/react-actions'
import { Loader, LoaderClient } from '@tanstack/react-loaders'
import { lazyRouteComponent, Outlet, Router, RootRoute, Route, RouterProvider } from '@tanstack/react-router'

import App from './pages/_app'
import NoMatch from './pages/404'

const root = new RootRoute({ component: App || Outlet })
const _404 = new Route({ getParentRoute: () => root, path: '*', component: NoMatch || Fragment })
const posts = new Route({
  getParentRoute: () => root,
  path: 'posts',
  component: lazyRouteComponent(() => import('./pages/posts/_layout')),
})
const postsindex = new Route({
  getParentRoute: () => posts,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/posts/index')),
})
const postsid = new Route({
  getParentRoute: () => posts,
  path: '$id',
  component: lazyRouteComponent(() => import('./pages/posts/[id]')),
})
const auth = new Route({
  getParentRoute: () => root,
  id: 'auth',
  component: lazyRouteComponent(() => import('./pages/(auth)/_layout')),
})
const authregister = new Route({
  getParentRoute: () => auth,
  path: 'register',
  component: lazyRouteComponent(() => import('./pages/(auth)/register')),
})
const authlogin = new Route({
  getParentRoute: () => auth,
  path: 'login',
  component: lazyRouteComponent(() => import('./pages/(auth)/login')),
})
const about = new Route({
  getParentRoute: () => root,
  path: 'about',
  component: lazyRouteComponent(() => import('./pages/about')),
})
const index = new Route({
  getParentRoute: () => root,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/index')),
  pendingComponent: lazyRouteComponent(() => import('./pages/index').then((m) => ({ default: m.Pending }))),
})

const indexAction = new Action({
  key: 'index',
  action: (...args) => import('./pages/index').then((m) => m.Action.apply(m.Action, args as any)),
})

const indexLoader = new Loader({
  key: 'index',
  loader: (...args) => import('./pages/index').then((m) => m.Loader.apply(m.Loader, args as any)),
})

const config = root.addChildren([
  posts.addChildren([postsindex, postsid]),
  auth.addChildren([authregister, authlogin]),
  about,
  index,
  _404,
])

const router = new Router({ routeTree: config })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const actionClient = new ActionClient({ getActions: () => [indexAction] })

declare module '@tanstack/react-actions' {
  interface Register {
    actionClient: typeof actionClient
  }
}
export const loaderClient = new LoaderClient({ getLoaders: () => [indexLoader] })

declare module '@tanstack/react-loaders' {
  interface Register {
    loaderClient: typeof loaderClient
  }
}
