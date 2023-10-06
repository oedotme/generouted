# Generouted + TanStack React Router

## How

This integration is based on a Vite plugin to generate routes config for TanStack React Router with `generouted` conventions. The output is saved at `src/routes.gen.tsx` and gets updated by the add/change/delete at `src/pages/*`.

## Getting started

In case you don't have a Vite project with React and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

### Installation

```shell
pnpm add @generouted/tanstack-react-router @tanstack/router@beta
```

Optional additional packages for actions and/or loaders:

```shell
pnpm add @tanstack/react-actions@beta @tanstack/react-loaders@beta
```

Optionally install `prettier` as a dev dependency so `generouted` formats the generated `src/routes.gen.tsx` file automatically:

```shell
pnpm add --save-dev prettier
```

### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/tanstack-react-router'

export default defineConfig({ plugins: [react(), generouted()] })
```

### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from './routes.gen'

createRoot(document.getElementById('root')!).render(<Routes />)
```

### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` **→** `/`, then export a default component:

```tsx
// src/pages/index.tsx

export default function Home() {
  return <h1>Home</h1>
}
```

### Optional root layout at `pages/_app.tsx`

```tsx
// src/pages/_app.tsx

import { Outlet } from '@tanstack/router'

export default function App() {
  return (
    <section>
      <header>
        <nav>...</nav>
      </header>

      <main>
        <Outlet />
      </main>
    </section>
  )
}
```

## Examples

### TanStack React Router

- [Basic](../../examples/tanstack-react-router/basic)

## License

MIT
