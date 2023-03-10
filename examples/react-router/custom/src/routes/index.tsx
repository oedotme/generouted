import { Fragment } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import type { ActionFunction, LoaderFunction } from 'react-router-dom'

import { generatePreservedRoutes } from 'generouted/core'
import { regularRoutes } from './regular'

type Element = () => JSX.Element
type Module = {
  default: Element
  Loader: LoaderFunction
  Action: ActionFunction
  Catch: Element
}

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', {
  eager: true,
})

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED)

const App = preservedRoutes?.['_app'] || Outlet
const NotFound = preservedRoutes?.['404'] || Fragment

export const routes = [
  {
    element: <App />,
    children: [...regularRoutes, { path: '*', element: <NotFound /> }],
  },
]

export const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />
