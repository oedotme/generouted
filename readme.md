<br>
<p align="center">
  <img src="https://raw.githubusercontent.com/oedotme/generouted/main/public/assets/icons/logo.svg" alt="Generouted · Generated Routes" width="180"/>
</p>
<p align="center">
  <a href="https://npmjs.com/package/generouted">
    <img src="https://img.shields.io/npm/v/generouted.svg" alt="generouted on npm">
  </a>
</p>
<br>

# Generouted

**Gene**rate**d** file-based **route**s for [React Location](https://react-location.tanstack.com) and [Vite](https://vitejs.dev)

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

<br>

## Features

- [File-based routing](#file-based-routing)
- [Route-based code-splitting and pre-loading](#route-based-code-splitting-and-pre-loading)
- [Route-based data loaders](#route-based-data-loaders)
- [Nested layouts](#nested-layouts)

### File-based routing

- [Next.js inspired](https://nextjs.org/docs/routing/introduction)
- Files within `src/pages` directory
- Supports `.jsx` and `.tsx` extensions
- Renders page's `default` export
- Custom app at `src/pages/_app.tsx` _(optional)_
- Custom 404 page at `src/pages/404.tsx` _(optional)_
- Navigation between routes using [React Location's `<Link />` component](https://react-location.tanstack.com/docs/api#link)

#### Conventions

##### Index routes

- `src/pages/index.tsx` **→** `/`
- `src/pages/posts/index.tsx` **→** `/posts`

##### Nested routes

- `src/pages/posts/2022/index.tsx` **→** `/posts/2022`
- `src/pages/posts/2022/resolutions.tsx` **→** `/posts/2022/resolutions`

##### Dynamic routes

- `src/pages/posts/[slug].tsx` **→** `/posts/:slug`
- `src/pages/posts/[slug]/tags.tsx` **→** `/posts/:slug/tags`
- `src/pages/posts/[...all].tsx` **→** `/posts/*`

### Route-based code-splitting and pre-loading

- Includes routes components and data loaders

### Route-based data loaders

- [Remix inspired](https://remix.run/docs/en/v1/guides/data-loading)
- By exporting a named function `Loader` from a page: `export const Loader = async () => ({...})`
- [React Location's route loaders guide](https://react-location.tanstack.com/guides/route-loaders)

### Nested layouts

- [Remix inspired](https://remix.run/docs/en/v1/guides/routing#what-is-nested-routing)
- Adding a layout for a group of routes by naming a file same as their parent directory
- Supports data loaders
- Requires React Location's `<Outlet />` component to render its children

#### Conventions

##### Enable for all directory routes

Add a layout for all the routes within `src/pages/posts` directory by adding `src/pages/posts.tsx` layout:

- `src/pages/posts/index.tsx` **→** `/posts`
- `src/pages/posts/2022/index.tsx` **→** `/posts/2022`
- `src/pages/posts/[slug].tsx` **→** `/posts/:slug`

##### Exclude a route - URL nesting without layout nesting

Replace regular file name with directory nesting by adding dots, it will be converted to forward slashes:

- `src/pages/posts.nested.as.url.not.layout.tsx` **→** `/posts/nested/as/url/not/layout`

<br>

## Getting started

If you have an existing Vite project setup with React you can skip this section and go to the [installation section](#installation).

Otherwise you can [scaffold a new Vite project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) with React and TypeScript:

```shell
npm create vite@latest react-file-based-routing -- --template react-ts   # npm 7+
```

## Installation

```shell
npm install generouted @tanstack/react-location
```

## Usage

Render the `<Routes />` component from `generouted` at the app entry _(you'd mostly wrap it with other providers/components)_:

```tsx
// src/main.tsx

import { render } from 'react-dom'
import { Routes } from 'generouted'

const container = document.getElementById('app')!
render(<Routes />, container)
```

### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` **→** `/`, then export a default component:

```tsx
export default function Home() {
  return <h1>Home</h1>
}
```

<br>

## Examples

- [Basic](./examples/basic)
- [Data loaders](./examples/data-loaders)
- [Nested layouts](./examples/nested-layouts)

<br>

## API

### `<Routes />`

`<Routes />` component accepts all [React Location's `RouterProps`](https://react-location.tanstack.com/docs/api#router) except `children`, `location` and `routes` props.

<br>

## License

MIT
