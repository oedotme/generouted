# Generouted + React Router + Type-safety

## How

This integration is based on a Vite plugin to generate routes config for React Router with `generouted` conventions. The output is saved at `src/routes.gen.tsx` and gets updated by the add/change/delete at `src/pages/*`.

## Getting started

### Installation

```shell
pnpm add @generouted/react-router react-router-dom
```

### Setup

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router'

export default defineConfig({ plugins: [react(), generouted()] })
```

### Usage

```tsx
// src/main.tsx

import { createRoot } from 'react-dom/client'
import { Routes } from './routes.gen'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
```

### Adding pages

Add the home page by creating a new file `src/pages/index.tsx` **→** `/`, then export a default component:

```tsx
// src/pages/index.tsx

export default function Home() {
  return <h1>Home</h1>
}
```

### Type-safe navigation

Autocompletion for `Link`, `useNavigate` and `useParams` exported from `src/route.gen.tsx`

```tsx
// src/pages/index.tsx
import { Link, useNavigate, useParams } from '../routes.gen'

export default function Home() {
  const navigate = useNavigate()

  // typeof params -> { id: string; pid?: string }
  const params = useParams('/posts/:id/:pid?')

  // typeof params to be passed -> { id: string; pid?: string }
  const handler = () => navigate('/posts/:id/:pid?', { params: { id: '1', pid: '0' } })

  return (
    <div>
      {/** ✅ Passes  */}
      <Link to="/" />
      <Link to="/posts/:id" params={{ id: '1' }} />
      <Link to="/posts/:id/:pid?" params={{ id: '1' }} />
      <Link to="/posts/:id/:pid?" params={{ id: '1', pid: 0 }} />

      {/** 🔴 Error: not defined route  */}
      <Link to="/not-defined-route" />

      {/** 🔴 Error: missing required params */}
      <Link to="/posts/:id" />

      <h1>Home</h1>
    </div>
  )
}
```

## Examples

### React Router

- [Plugin](../../examples/react-router/plugin)

## License

MIT
