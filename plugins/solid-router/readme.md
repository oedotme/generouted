# Generouted + Solid Router + Type-safety

## How

This integration is based on a Vite plugin to generate routes types for Solid Router with `generouted` conventions. The output is saved by default at `src/router.ts` and gets updated by the add/change/delete at `src/pages/*`.

## Getting started

In case you don't have a Vite project with React and TypeScript, check [Vite documentation to start a new project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

### Installation

```shell
pnpm add @generouted/solid-router generouted @solidjs/router
```

- `generouted` provides the file-based routes
- `@generouted/solid-router` generates types and type-safe router component/hooks

### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/solid-router'

export default defineConfig({ plugins: [react(), generouted()] })
```

### Usage

```tsx
// src/main.tsx

import { render } from 'solid-js/web'
import { Routes } from 'generouted/solid-router'

render(Routes, document.getElementById('app') as HTMLElement)
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

import { ParentProps } from 'solid-js'

export default function App(props: ParentProps) {
  return (
    <section>
      <header>
        <nav>...</nav>
      </header>

      <main>{props.children}</main>
    </section>
  )
}
```

### Type-safe navigation

Autocompletion for `Link`, `useNavigate`, `useParams` and more exported from `src/router.ts`

```tsx
// src/pages/index.tsx
import { A, useNavigate, useParams } from '../router'

export default function Home() {
  const navigate = useNavigate()

  // typeof params -> { id: string; pid?: string }
  const params = useParams('/posts/:id/:pid?')

  // typeof params to be passed -> { id: string; pid?: string }
  const handler = () => navigate('/posts/:id/:pid?', { params: { id: '1', pid: '0' } })

  return (
    <div>
      {/** ✅ Passes  */}
      <A href="/" />
      <A href="/posts/:id" params={{ id: '1' }} />
      <A href="/posts/:id/:pid?" params={{ id: '1' }} />
      <A href="/posts/:id/:pid?" params={{ id: '1', pid: 0 }} />

      {/** 🔴 Error: not defined route  */}
      <A href="/not-defined-route" />

      {/** 🔴 Error: missing required params */}
      <A href="/posts/:id" />

      <h1>Home</h1>
    </div>
  )
}
```

## Examples

- [Plugin](../../examples/solid-router)

## License

MIT
