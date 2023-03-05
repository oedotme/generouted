<br>
<p align="center">
  <img src="https://raw.githubusercontent.com/oedotme/generouted/main/logo.svg" alt="Generouted · Generated Routes" width="180"/>
</p>
<p align="center">
  <a href="https://npmjs.com/package/generouted">
    <img src="https://img.shields.io/npm/v/generouted.svg" alt="generouted on npm">
  </a>
</p>
<br>

# Generouted

**Gene**rate**d** file-based **route**s for [Vite](https://vitejs.dev)

<br>

## Motivation

I enjoyed working with file-based routing since started using it with Next.js. After trying the same concept with Vite, I started a series of blog posts covering [client-side file-based routing with React Router](https://omarelhawary.me/blog/file-based-routing-with-react-router) inspired by [Next.js](https://nextjs.org). Later, in the last two posts, I replaced React Router with React Location to add more features like data loaders and nested layouts that are inspired by [Remix](https://remix.run). The final version covered in the blog posts is now published as `generouted`, see all the [available features](#features) below.

## How

`generouted` is only one _source code_ file, with **no dependencies or build step**. It uses [Vite's glob import API](https://vitejs.dev/guide/features.html#glob-import) to list the modules within `src/pages` directory to be used as React Location's routes.

## Why

- **Declarative and universal file-based routing** system
- **Automatically update routes** by adding/removing/renaming files at the `src/pages` directory
- Can be used with **any Vite project**
- **Easier to migrate** when switching from or to Next.js
- [Automatic route-based code-splitting and pre-loading](#route-based-code-splitting-and-pre-loading)
- [Route-based data loaders](#route-based-data-loaders)
- [Route-based actions](#route-based-actions)

<br>

## Framework support

- React with [React Router w/ type-safe navigation 🆕](https://reactrouter.com)
- React with [TanStack React Router 🆕](./plugins/tanstack-react-router)
- React with [TanStack's React Location](https://react-location.tanstack.com)
- Solid with [Solid Router](https://github.com/solidjs/solid-router)

## Getting started

In case you don't have a Vite project with React and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

### React Router w/ type-safe navigation 🆕

#### Installation

```shell
pnpm add @generouted/react-router generouted react-router-dom
```

- `generouted` provides the file-based routes
- `@generouted/react-router` optional but recommended plugin to generates types and type-safe router component/hooks/utils

#### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router'

export default defineConfig({ plugins: [react(), generouted()] })
```

#### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted/react-router'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
```

🚀 Check more about type-safe navigation and global modals [in the plugin docs](./plugins/react-router).

### TanStack React Router 🆕

[Check out the docs here](./plugins/tanstack-react-router)

### React Location

#### Installation

```shell
pnpm add generouted @tanstack/react-location
```

#### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted/react-location'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
```

### Solid Router

If you're using Solid, check out their [getting started guide](https://www.solidjs.com/guides/getting-started#try-solid) to start a new project.

#### Installation

```shell
pnpm add generouted @solidjs/router
```

#### Usage

```tsx
// src/main.tsx

import { render } from 'solid-js/web'
import { Routes } from 'generouted/solid-router'

render(Routes, document.getElementById('app')!)
```

### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` **→** `/`, then export a default component:

```tsx
export default function Home() {
  return <h1>Home</h1>
}
```

See more about `generouted` [routing conventions below](#conventions).

<br>

## Features

- [File-based routing](#file-based-routing)
- [Route-based code-splitting and pre-loading](#route-based-code-splitting-and-pre-loading)
- [Route-based data loaders and actions](#route-based-data-loaders)
- [Route-based actions](#route-based-actions)
- [Nested layouts](#nested-layouts)

### File-based routing

- [Next.js inspired](https://nextjs.org/docs/routing/introduction)
- Files within `src/pages` directory
- Supports `.jsx` and `.tsx` extensions
- Renders page's `default` export
- Custom app at `src/pages/_app.tsx` _(optional)_
- Custom 404 page at `src/pages/404.tsx` _(optional)_
- Navigation between routes using the routing library `Link` or `A` component

### Route-based code-splitting and pre-loading

- Includes routes components, data loaders and actions
- Pre-loading is only available for TanStack's React Location

### Route-based data loaders

- [Remix inspired](https://remix.run/docs/en/v1/guides/data-loading)
- By exporting a named function `Loader` from a page: `export const Loader = async () => ({...})`
- [React Location's route loaders guide](https://react-location.tanstack.com/guides/route-loaders)

### Route-based actions

- Actions are only available for React Router
- By exporting a named function `Action` from a page: `export const Action = async () => ({...})`

### Nested layouts

- [Remix inspired](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing)
- Adding a layout for a group of routes by naming a file same as their parent directory or using a `_layout.tsx` file inside of the nested directory
- Supports data loaders
- Requires `<Outlet />` component to render its children

<br>

## Conventions

### Index routes

- `src/pages/index.tsx` **→** `/`
- `src/pages/posts/index.tsx` **→** `/posts`

### Nested routes

- `src/pages/posts/2022/index.tsx` **→** `/posts/2022`
- `src/pages/posts/2022/resolutions.tsx` **→** `/posts/2022/resolutions`

### Dynamic routes

- `src/pages/posts/[slug].tsx` **→** `/posts/:slug`
- `src/pages/posts/[slug]/tags.tsx` **→** `/posts/:slug/tags`
- `src/pages/posts/[...all].tsx` **→** `/posts/*`

### Nested layouts

#### Enable for all directory routes

Add a layout for all the routes within `src/pages/posts` directory by adding `src/pages/posts.tsx` or `src/pages/posts/_layout.tsx`:

- `src/pages/posts.tsx` or `src/pages/posts/_layout.tsx`
  - `src/pages/posts/index.tsx` **→** `/posts`
  - `src/pages/posts/2022/index.tsx` **→** `/posts/2022`
  - `src/pages/posts/[slug].tsx` **→** `/posts/:slug`

#### Exclude a route - URL nesting without layout nesting

Add a file outside of the directory with a nested layout, then name the file by adding a dot between each segment, it will be converted to forward slashes:

- `src/pages/posts.nested.as.url.not.layout.tsx` **→** `/posts/nested/as/url/not/layout`

### Pathless layout groups 🆕

By wrapping a directory name with `()`: `src/pages/(app)/...`

```shell
src/pages/
├── (app)/
│   ├── _layout.tsx
│   ├── dashboard.tsx      →  /dashboard      wrapped by (app)/_layout.tsx
│   └── item.tsx           →  /item           wrapped by (app)/_layout.tsx
├── (marketing)/
│   ├── _layout.tsx
│   ├── about.tsx          →  /about          wrapped by (marketing)/_layout.tsx
│   └── testimonials.tsx   →  /testimonials   wrapped by (marketing)/_layout.tsx
└── admin/
    ├── _layout.tsx
    └── index.tsx          →  /admin          wrapped by admin/_layout.tsx
```

### Optional route segments 🆕

By prefixing a minus sign `-` to a segment; meaning this segment can be subtracted/removed from route url:

- `src/pages/-some/thing.tsx` → `/some?/thing`
- `src/pages/-[param]/another.tsx` → `/:param?/another`

React Router [v6.5.0+](https://github.com/remix-run/react-router/releases/tag/react-router@6.5.0) supports regular and dynamic optional route segments:

```shell
src/pages/-en/about.tsx  →  /en?/about            /en/about and /about
src/pages/-[lang]/about.tsx  →  /:lang?/about     /en/about, /fr/about, /about
```

However other integration might only support optional dynamic segments:

```shell
src/pages/-[lang]/about.tsx  →  /:lang?/about     /en/about, /fr/about, /about
```

### Ignored routes - co-locating non-pages files inside the pages directory

Any directory or a file starts with `_` will be ignored

- `src/pages/_ignored.tsx`
- `src/pages/posts/_components/button.tsx`
- `src/pages/posts/_components/link.tsx`

<br>

## API

### React Location

#### `<Routes />`

`<Routes />` component accepts all [React Location's `RouterProps`](https://react-location.tanstack.com/docs/api#router) except `children`, `location` and `routes` props.

### React Router

#### `<Routes />`

No available props.

### Solid Router

#### `<Routes />`

No available props.

<br>

## Examples

### React Router

- [Basic](./examples/react-router/basic)
- [Nested layouts](./examples/react-router/nested-layouts)
- [Plugin w/ type-safe navigation](./examples/react-router/plugin) 🆕

### TanStack React Router 🆕

- [Basic](./examples/tanstack-react-router/basic)

### TanStack React Location

- [Basic](./examples/react-location/basic)
- [Data loaders](./examples/react-location/data-loaders)
- [Modals](./examples/react-location/modals)
- [Nested layouts](./examples/react-location/nested-layouts)

### Solid Router

- [Basic](./examples/solid-router/basic)

<br>

## License

MIT
