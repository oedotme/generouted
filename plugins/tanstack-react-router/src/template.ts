export const template = `// Generouted, changes to this file will be overriden
import { Fragment } from 'react'// actions-imports// loaders-imports
import { lazy, ReactRouter, RootRoute, Route, RouterProvider } from '@tanstack/react-router'

// imports

// modules// actions// loaders

const config = root.addChildren([
  // config,
  _404,
])

const router = new ReactRouter({ routeTree: config })
export const Routes = () => <RouterProvider router={router} />

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// actions-client// actions-type
// loaders-client// loaders-type
`
