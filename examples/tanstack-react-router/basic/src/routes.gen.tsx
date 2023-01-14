// Generouted, changes to this file will be overriden
import { Fragment } from 'react'
import { createReactRouter, createRouteConfig, lazy, RouterProvider } from '@tanstack/react-router'

import App from './pages/_app'
import NoMatch from './pages/404'

const root = createRouteConfig({ component: App || Fragment })
const _404 = root.createRoute({ path: '*', component: NoMatch || Fragment })
const posts = root.createRoute({ path: 'posts', component: lazy(() => import('./pages/posts/_layout')) })
const postsindex = posts.createRoute({ path: '/', component: lazy(() => import('./pages/posts/index')) })
const postsblog = posts.createRoute({ path: 'blog', component: lazy(() => import('./pages/posts/blog/_layout')) })
const postsbloglist = postsblog.createRoute({ path: 'list', component: lazy(() => import('./pages/posts/blog/list')) })
const postsid = posts.createRoute({ path: '$id', component: lazy(() => import('./pages/posts/[id]')) })
const auth = root.createRoute({ id: 'auth', component: lazy(() => import('./pages/(auth)/_layout')) })
const authregister = auth.createRoute({ path: 'register', component: lazy(() => import('./pages/(auth)/register')) })
const authlogin = auth.createRoute({ path: 'login', component: lazy(() => import('./pages/(auth)/login')) })
const about = root.createRoute({ path: 'about', component: lazy(() => import('./pages/about')) })
const index = root.createRoute({
  path: '/',
  component: lazy(() => import('./pages/index')),
  loader: (...args) => import('./pages/index').then((m) => m.Loader.apply(m.Loader, args as any)),
  action: (...args) => import('./pages/index').then((m) => m.Action.apply(m.Action, args as any)),
  pendingComponent: lazy(() => import('./pages/index').then((m) => ({ default: m.Pending }))),
  errorComponent: lazy(() => import('./pages/index').then((m) => ({ default: m.Catch }))),
})

const config = root.addChildren([
  posts.addChildren([postsindex, postsblog.addChildren([postsbloglist]), postsid]),
  auth.addChildren([authregister, authlogin]),
  about,
  index,
  _404,
])

const router = createReactRouter({ routeConfig: config, defaultPreload: 'intent' })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}
