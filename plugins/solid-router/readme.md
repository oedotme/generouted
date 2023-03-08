# Generouted + Solid Router + Type-safety

## How

This integration is based on a Vite plugin to generate routes types for Solid Router with `generouted` conventions. The output is saved by default at `src/router.ts` and gets updated by the add/change/delete at `src/pages/*`.

## Getting started

In case you don't have a Vite project with Solid and TypeScript, check out this [getting started guide](https://www.solidjs.com/guides/getting-started#try-solid) to start a new project.

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
import solid from 'vite-plugin-solid'
import generouted from '@generouted/solid-router'

export default defineConfig({ plugins: [solid(), generouted()] })
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

Auto-completion for `A`, `useNavigate`, `useParams` and more exported from `src/router.ts`

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

### Type-safe global modals

Although all modals are global, it's nice to co-locate modals with relevant routes.

Create modal routes by prefixing a valid route file name with a plus sign `+`. Why `+`? You can think of it as an extra route, as the modal overlays the current route:

```tsx
// src/pages/+login.tsx

import { Modal } from '@/ui'

export default function Login() {
  return <Modal>Content</Modal>
}
```

To navigate to a modal use `useModals` hook exported from `src/router.ts`:

```tsx
// src/pages/_app.tsx

import { ParentProps } from 'solid-js'

import { useModals } from '../router'

export default function App(props: ParentProps) {
  const modals = useModals()

  return (
    <section>
      <header>
        <nav>...</nav>
        <button onClick={() => modals.open('/login')}>Open modal</button>
      </header>

      <main>{props.children}</main>
    </section>
  )
}
```

With `useModals` you can use `modals.open('/modal-path')` and `modals.close()`, and by default it opens/closes the modal on the current active route.

Both methods come with React Router's `navigate()` options with one prop added `at`, for optionally navigating to a route while opening/closing a modal, and it's also type-safe!

- `modals.open(path, options)`
- `modals.close(options)`

`at` should be also a valid route path, here are some usage examples:

- `modals.open('/login', { at: '/auth', replace: true })`
- `modals.open('/info', { at: '/invoice/:id', { params: { id: 'xyz' } } })`
- `modals.close({ at: '/', replace: false })`

## Examples

- [Plugin](../../examples/solid-router)

## License

MIT
