export const template = `// Generouted, changes to this file will be overriden
import { Fragment } from 'react'
import { createReactRouter, createRouteConfig, lazy, RouterProvider } from '@tanstack/react-router'

// imports

// modules

const config = root.addChildren([
  // config,
  _404,
])

const router = createReactRouter({ routeConfig: config, defaultPreload: 'intent' })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}
`
