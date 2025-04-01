<br>
<p align="center"><img src="https://raw.githubusercontent.com/oedotme/generouted/main/logo.svg" alt="generouted" width="280"/></p>
<p align="center">
  <a href="https://npmjs.com/package/generouted"><img src="https://img.shields.io/npm/v/generouted.svg"/></a>
  <a href="https://npmjs.com/package/generouted"><img src="https://img.shields.io/npm/l/generouted.svg?color=blue"/></a>
  <a href="https://stackblitz.com/github.com/oedotme/generouted/tree/main/explorer"><img src="https://img.shields.io/badge/generouted/explorer-StackBlitz-blue"/></a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/generouted"><img src="https://img.shields.io/npm/dm/generouted.svg"/></a>
  <a href="https://npmjs.com/package/generouted"><img src="https://img.shields.io/npm/dt/generouted.svg"/></a>
</p>
<br>

# Generouted

Generated file-based routes for [Vite](https://vitejs.dev)

<details>
<summary><b>Motivation</b></summary>

<br>

I enjoyed using file-based routing since I tried Next.js (pages directory). After applying the same concept with Vite and client-side applications, I started writing blog posts covering the implementation of [client-side file-based routing with React Router](https://omarelhawary.me/blog/file-based-routing-with-react-router) which was packaged later as `generouted`.

Today `generouted` brings many features, supports multiple frameworks and routers, and inspires ideas and conventions from Next.js, Remix, Expo, Docusaurus, SvelteKit and more.

<br>

</details>

<details>
<summary><b>How does it work?</b></summary>

<br>

`generouted` uses [Vite's glob import API](https://vitejs.dev/guide/features.html#glob-import) to list the routes within the `src/pages` directory and generates the routes tree and modals based on `generouted`'s conventions.

There are also Vite plugins available for some integrations to provide type-safe components/hooks/utils through code-generation.

<br>

</details>

<br>

## Features

- 📁 Client-side file-based routing
- ⚡ Powered by [Vite](https://vitejs.dev)
- ✨ React support with [`react-router`](https://github.com/remix-run/react-router) or [`@tanstack/router`](https://github.com/tanstack/router) 🧪 or [`@tanstack/react-location`](https://github.com/tanstack/router/tree/9c8eb043e4ac350fc1d28655542e01defb0c82e5) 🚨
- ✨ Solid support with [`@solidjs/router`](https://github.com/solidjs/solid-router)
- ✨ File-based MDX routes with React or Solid, requires [`@mdx-js/rollup`](https://mdxjs.com/packages/rollup) [installation and setup](/examples/react-router-mdx)
- 🔐 Type-safe navigation
- 🚀 Type-safe global modals
- 💤 Route-based code-splitting and lazy-loading
- 📄 Route-based data loaders and actions
- 💣 Route-based error boundary
- 📂 Nested layouts
- 🫙 Pathless layout groups
- ❓ Optional static and dynamic routes
- 💭 Ignored routes per file or directory

<br>

## Online explorer

- ⚡ Visit [`generouted`'s interactive playground via StackBlitz](https://stackblitz.com/github.com/oedotme/generouted/tree/main/explorer)
- 🧩 Explore file-based routing patterns and conventions
- 🔎 Visualize the routes layouts and the resolved routes paths
- 📝 Update `src/pages/` files and see your changes reflecting

<br>

## Getting started

<details open="true">
<summary><b>React Router</b></summary>

### React Router

In case you don't have a Vite project with React and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

#### Installation

```shell
pnpm add @generouted/react-router react-router
```

#### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'

export default defineConfig({ plugins: [react(), generouted.vite()] })
```

#### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'

createRoot(document.getElementById('root')!).render(<Routes />)
```

#### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` → `/`, then export a default component:

```tsx
export default function Home() {
  return <h1>Home</h1>
}
```

Check the [routing conventions section below](#conventions).

#### Docs

You can find more details about type-safe navigation and global modals at [`@generouted/react-router` docs](/packages/react-router).

#### Examples

- [Type-safe navigation + global modals](/examples/react-router)
- [Custom integration](/examples/react-router-custom)
- [Custom integration with custom path](/examples/react-router-custom-path)
- [MDX routes](/examples/react-router-mdx)

<br>

</details>

<details open="true">
<summary><b>Solid Router</b></summary>

### Solid Router

In case you don't have a Vite project with Solid and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

#### Installation

```shell
pnpm add @generouted/solid-router @solidjs/router
```

#### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import generouted from '@generouted/solid-router/plugin'

export default defineConfig({ plugins: [solid(), generouted.vite()] })
```

#### Usage

```tsx
// src/main.tsx

import { render } from 'solid-js/web'
import { Routes } from '@generouted/solid-router'

render(Routes, document.getElementById('root')!)
```

#### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` → `/`, then export a default component:

```tsx
export default function Home() {
  return <h1>Home</h1>
}
```

See more about `generouted` [routing conventions below](#conventions).

#### Docs

You can find more details about type-safe navigation and global modals at [`@generouted/solid-router` docs](/packages/solid-router).

#### Examples

- [Type-safe navigation + global modals](/examples/solid-router)

<br>

</details>

<details>
<summary><b>TanStack React Router — In-progress experimental support 🧪</b></summary>

### TanStack React Router — In-progress experimental support 🧪

[Check out the docs here](/packages/tanstack-react-router)

#### Examples

- [Basic](/examples/tanstack-react-router)

<br>

</details>

<details>
<summary><b>React Location — Deprecated 🚨</b></summary>

### React Location — Deprecated 🚨

In case you don't have a Vite project with React and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

#### Installation

```shell
pnpm add generouted @tanstack/react-location
```

#### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted/react-location'

createRoot(document.getElementById('root')!).render(<Routes />)
```

#### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` → `/`, then export a default component:

```tsx
export default function Home() {
  return <h1>Home</h1>
}
```

#### Examples

- [Basic](/examples/react-location/basic)
- [Data loaders](/examples/react-location/data-loaders)
- [Modals](/examples/react-location/modals)
- [Nested layouts](/examples/react-location/nested-layouts)

<br>

</details>

<br>

## Conventions

### File and directories naming and conventions

- Routes declaration at `src/pages`
- Supports `.tsx`, `.jsx` and `.mdx` file extensions
- Optional `src/pages/_app.tsx` for an **app level layout**
- Optional `src/pages/404.tsx` for a **custom not-found page**

#### Index routes

- `src/pages/index.tsx` → `/`
- `src/pages/posts/index.tsx` → `/posts`

#### Nested routes

- `src/pages/posts/2022/index.tsx` → `/posts/2022`
- `src/pages/posts/2022/resolutions.tsx` → `/posts/2022/resolutions`

#### Dynamic routes

- `src/pages/posts/[slug].tsx` → `/posts/:slug`
- `src/pages/posts/[slug]/tags.tsx` → `/posts/:slug/tags`
- `src/pages/posts/[...all].tsx` → `/posts/*`

#### Nested layouts

- By defining `_layout.tsx` in any nested directory → `src/pages/posts/_layout.tsx`
- **Requires** using an `<Outlet />` component to render layout children
- All the files within the `src/pages/posts/` directory in this case, will be wrapped with that layout

#### Nested URLs without nested layouts

- Route file should be outside of the nested layout directory
- Include **dots** `.` between the segments to be converted to forward slashes
- `src/pages/posts.nested.as.url.not.layout.tsx` → `/posts/nested/as/url/not/layout`

#### Pathless layouts

- Similar to nested layouts for layout definition
- By wrapping the parent directory with **parentheses** `()`
- `src/pages/(auth)/_layout.tsx`
- `src/pages/(auth)/login.tsx` → `/login`
- Layout parent directory name is not included in the routes paths

#### Global modals

- By **prefixing** the file name with a **plus sign** `+` _(thinking the modal is an extra route overlaying the current route)_
- Modals navigation available via the `useModals()` hook
- `src/pages/+info.tsx` → `/info`
- `src/pages/+checkout/+details.tsx` → `/checkout/details`
- `src/pages/+checkout/+payment.tsx` → `/checkout/payment`

#### Optional segments

- By **prefixing** a route segment with a **minus sign** `-` _(thinking the segment can be subtracted or removed from the route path)_
- `src/pages/-en/about.tsx` → `/en?/about` → `/en/about`, `/about`
- `src/pages/-[lang]/about.tsx` → `/:lang?/about` → `/en/about`, `/fr/about`, `/about`

#### Ignored routes

- Any directory or file starts with an **underscore** `_` will be **ignored**
- `src/pages/_ignored.tsx`
- `src/pages/posts/_components/button.tsx`
- `src/pages/posts/_components/link.tsx`

<br>

### Page exports

- **Required** page component `export default Component() {...}`
- Optional page loader function `export const Loader = () => {...}`
- Optional page action function `export const Action = () => {...}`
- Optional suspense-based pending component `export const Pending = () => {...}`
- Optional error boundary component `export const Catch = () => {...}`

<br>

### Example

<details>
<summary><b>Directory structure</b></summary>

<br>

```shell
src/pages
├── (auth)
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── blog
│   ├── _components
│   │   ├── button.tsx
│   │   └── comments.tsx
│   ├── [...all].tsx
│   ├── [slug].tsx
│   ├── _layout.tsx
│   ├── index.tsx
│   └── tags.tsx
├── docs
│   ├── -[lang]
│   │   ├── index.tsx
│   │   └── resources.tsx
│   └── -en
│       └── contributors.tsx
├── +info.tsx
├── 404.tsx
├── _app.tsx
├── _ignored.tsx
├── about.tsx
├── blog.w.o.layout.tsx
└── index.tsx
```

</details>

<details open="true">
<summary><b>Overview</b></summary>

<br>

| File                            | Path                     | Convention                            |
| :------------------------------ | :----------------------- | :------------------------------------ |
| `(auth)/_layout.tsx`            |                          | Pathless Layout group                 |
| `(auth)/login.tsx`              | `/login`                 | Regular route                         |
| `(auth)/register.tsx`           | `/register`              | Regular route                         |
| `blog/_components/button.tsx`   |                          | Ignored route by an ignored directory |
| `blog/_components/comments.tsx` |                          | Ignored route by an ignored directory |
| `blog/[...all].tsx`             | `/blog/*`                | Dynamic catch-all route               |
| `blog/[slug].tsx`               | `/blog/:slug`            | Dynamic route                         |
| `blog/_layout.tsx`              |                          | Layout for `/blog` routes             |
| `blog/index.tsx`                | `/blog`                  | Index route                           |
| `blog/tags.tsx`                 | `/blog/tags`             | Regular route                         |
| `docs/-[lang]/index.tsx`        | `/docs/:lang?/index`     | Optional dynamic route segment        |
| `docs/-[lang]/resources.tsx`    | `/docs/:lang?/resources` | Optional dynamic route segment        |
| `docs/-en/contributors.tsx`     | `/docs/en?/contributors` | Optional static route segment         |
| `+info.tsx`                     | `/info`                  | Modal route                           |
| `404.tsx`                       | `*`                      | Custom `404` _(optional)_             |
| `_app.tsx`                      |                          | Custom `app` layout _(optional)_      |
| `_ignored.tsx`                  |                          | Ignored route                         |
| `about.tsx`                     | `/about`                 | Regular route                         |
| `blog.w.o.layout.tsx`           | `/blog/w/o/layout`       | Route without `/blog` layout          |
| `index.tsx`                     | `/`                      | Index route                           |

</details>

<br>

## API

### Routing

Via [`@generouted/react-router`](/packages/react-router) or [`@generouted/solid-router`](/packages/solid-router)

- `<Routes />` — file-based routing component to be render in the app entry
- `routes` — file-based routes tree/object used by default at `<Routes />` component

### Routing + code-splitting and lazy-loading

Via `@generouted/react-router/lazy` or `@generouted/solid-router/lazy`

- Used instead of `@generouted/react-router` or `@generouted/solid-router` to enable lazy-loading
- Make sure to replace all imports to lazy imports — namely at app entry and `src/pages/_app.tsx`
- Provides the same `<Routes />` and `routes` exports

### Plugins

Via `@generouted/react-router/plugin` or `@generouted/solid-router/plugin`

- Vite plugin for type generation and initializing type-safe components/hooks/utils
- Generates `src/router.ts` file
- Exports type-safe `<Link>`, `<Navigate>`, `useModals()`, `useNavigate()`, `useParams()`, `redirect()`, etc.
- Check out [`@generouted/react-router` docs](/packages/react-router) or [`@generouted/solid-router` docs](/packages/solid-router) for more details

### Core

Via `@generouted/react-router/core` or `@generouted/solid-router/core`

- Available for customization, however it's recommended to use the available integrations directory via the `<Routes/>` component
- Check out the [custom integration example](/examples/react-router-custom)

<br>

## FAQ

<details>
<summary><b>How to implement protected or guarded routes?</b></summary>

<br>

There are multiple approaches to achieve that. If you prefer handling the logic in one place, you can define the protected routes with redirection handling within a component:

```tsx
// src/config/redirects.tsx

import { Navigate, useLocation } from 'react-router'

import { useAuth } from '../context/auth'
import { Path } from '../router'

const PRIVATE: Path[] = ['/logout']
const PUBLIC: Path[] = ['/login']

export const Redirects = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()
  const location = useLocation()

  const authenticatedOnPublicPath = auth.active && PUBLIC.includes(location.pathname as Path)
  const unAuthenticatedOnPrivatePath = !auth.active && PRIVATE.includes(location.pathname as Path)

  if (authenticatedOnPublicPath) return <Navigate to="/" replace />
  if (unAuthenticatedOnPrivatePath) return <Navigate to="/login" replace />

  return children
}
```

Then use that component (`<Redirects>` ) at the root-level layout `src/pages/_app.tsx` to wrap the `<Outlet>` component:

```tsx
// src/pages/_app.tsx

import { Outlet } from 'react-router'

import { Redirects } from '../config/redirects'

export default function App() {
  return (
    <section>
      <header>
        <nav>...</nav>
      </header>

      <main>
        <Redirects>
          <Outlet />
        </Redirects>
      </main>
    </section>
  )
}
```

You can find a full example of this approach at [Render template](https://github.com/oedotme/render/blob/main/src/config/redirects.tsx)

<br>

</details>

<details>
<summary><b>How to use with Hash or Memory Routers?</b></summary>

<br>

You can use the exported `routes` object to customize the router or to use hash/memory routers:

```tsx
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router'
import { routes } from '@generouted/react-router'

const router = createHashRouter(routes)
const Routes = () => <RouterProvider router={router} />

createRoot(document.getElementById('root')!).render(<Routes />)
```

<br>

</details>

<br>

## License

MIT
