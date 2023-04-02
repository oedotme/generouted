import { generateRegularRoutes, patterns } from '@generouted/react-router/core'
import { Link, Location, RouteObject, useLocation } from 'react-router-dom'

import { Arrow, Directory, File } from '@/icons'
import { classNames } from '@/utils'

const PRESERVED = import.meta.glob('/src/pages/(_app|404).{jsx,tsx}', { eager: true })
const MODALS = import.meta.glob('/src/pages/**/[+]*.{jsx,tsx}', { eager: true })
const ROUTES = import.meta.glob(['/src/pages/**/[\\w[-]*.{jsx,tsx}', '!**/(_app|404).*'], { eager: true })

type Route = RouteObject & Partial<{ key: string; modal: boolean; pathname: string }>

const preserved = Object.keys(PRESERVED).map((key) => key.replace(...patterns.route))
const routes = generateRegularRoutes<Route, {}>({ ...ROUTES, ...MODALS }, (_, key) => ({
  ...(key.includes('/+') ? { modal: true } : {}),
  key: key.replace(...patterns.route),
  pathname: key.includes('/+')
    ? `${key}`
        .replace(...patterns.route)
        .replace(/\+/g, '')
        .replace(/(\/)?index/g, '')
        .replace(/\./g, '/')
    : key
        .replace(...patterns.route)
        .replace(...patterns.splat)
        .replace(...patterns.param)
        .replace(/\/?index|\./g, '/')
        .replace(/(\w)\/$/g, '$1')
        .split('/')
        .map((segment) => segment.replace(...patterns.optional))
        .join('/'),
}))

const sort = (routes: Route[]) => [
  ...routes.filter((x) => x.children?.length).sort((a, z) => a?.id!?.localeCompare(z?.id!)),
  ...routes.filter((x) => !x.children?.length).sort((a, z) => a?.id!?.localeCompare(z?.id!)),
]

const Tree = ({ routes, depth, location }: { routes: Route[]; depth: number; location: Location }) => {
  return (
    <ul className="flex select-none flex-col text-sm font-medium">
      {routes?.map((route) => {
        const pathname = route.pathname?.startsWith('/') ? route.pathname : `/${route.pathname}`
        const path = pathname!.replace(/\(\w+\)\/|\/?_layout/g, '').replace('?', '')
        const paddingLeft = depth * 20
        const disabled = preserved.includes(route?.id!) || route.id?.includes('_layout')

        return (
          <li key={route?.id + route?.path!} className="flex flex-col">
            {route?.children?.length ? (
              <details open={true}>
                <summary className="cursor-pointer space-x-2 py-2.5" style={{ paddingLeft }}>
                  <Directory className="ml-1 inline h-4 w-4" />
                  <span>
                    {route.key?.includes('_layout')
                      ? route.key.split('/')?.at(-2)
                      : route.id || route?.children?.[0]?.id?.split('/')?.at(-2) || route.path}
                  </span>
                </summary>
                <Tree
                  routes={sort(
                    route.pathname?.includes('_layout')
                      ? [{ id: route.key, pathname: route.pathname }, ...route.children]
                      : route.children
                  )}
                  depth={depth + 1}
                  location={location}
                />
              </details>
            ) : (
              <Link
                to={route.modal ? location.pathname : path}
                className={classNames(
                  'flex space-x-2 py-2.5',
                  location.pathname === path && !pathname.includes('_layout') ? 'bg-slate-50' : '',
                  disabled ? 'pointer-events-none text-slate-300' : 'text-primary'
                )}
                state={route.modal ? { modal: path } : null}
                style={{ paddingLeft }}
              >
                <File className="h-4 w-4" />
                <span>
                  <span>{route.id?.split('/')?.at(-1)}</span>
                  <span className="">.tsx</span>
                </span>
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export const Routes = () => {
  const location = useLocation()

  return (
    <header className="w-80">
      <nav className="h-full rounded-lg border border-dashed border-slate-500 bg-white py-6">
        <section className="flex items-center space-x-3 px-6 pb-6 pt-1 text-primary">
          <img className="h-4 w-4" src="/favicon.svg" />
          <a
            className="flex items-center space-x-1 text-sm font-bold underline"
            href="https://github.com/oedotme/generouted"
            target="_blank"
          >
            <span>Generouted Explorer</span>
            <Arrow className="h-3.5 -rotate-[135deg]" />
          </a>
        </section>

        <Tree
          routes={[{ id: 'src/pages', children: sort([...routes, ...preserved.map((x) => ({ id: x, pathname: x }))]) }]}
          depth={1}
          location={location}
        />
      </nav>
    </header>
  )
}
