# Generouted

**Gene**rat**ed** **rout**es using [React Location](https://react-location.tanstack.com) and [Vite](https://vitejs.dev)

## Motivation

Vite is a next generation frontend tool and it is very fast, you can't go back xd. After discovering the possibility of accessing local project modules using Vite, I started writing a series about [client-side file-based routing with React Router](https://omarelhawary.me/blog/file-based-routing-with-react-router) inspired by [Next.js](https://nextjs.org). Later I replaced React Router with React Location to support more features like data loaders and nested layouts that are inspired by [Remix](https://remix.run).

## How it works

`generouted` is only one file that uses Vite APIs to list modules within `src/pages/` directory and iterates over them to build the routes passed to React Location.

## Why to use it

- Can be used with **any Vite project**
- Declarative and **universal file-based routing** system
- **Easier to migrated** when switching from or to Next.js

## Features

- **File-based routing** (Next.js conventions)
- Route-based **code-splitting**
- Routes **pre-loading**
- Route-based **data loaders**
- **Nested layouts** supporting data loaders

## Usage

1. Install

```shell
npm install generouted
# or
# pnpm add generouted
# yarn add generouted
```

2. Setup

With a Vite and React project, render the `<Routes />` components from `generouted` directly or wrap it with other providers/components:

React >= 17:

```tsx
import { render } from 'react-dom'
import { Routes } from 'generouted'

const container = document.getElementById('app')!
render(<Routes />, container)
```

React 18:

```tsx
import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
```

3. Add pages

Add your home page by creating `src/pages/index.tsx`:

```tsx
// src/pages/index.tsx

export default function Home() {
  return <h1>Home</h1>
}
```

## Examples

- [Basic](./examples/basic)
