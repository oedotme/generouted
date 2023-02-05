# Generouted + TanStack React Router

## How

This integration is based on a Vite plugin to generate routes config for TanStack React Router with `generouted` conventions. The output is saved at `src/routes.gen.tsx` and gets updated by the add/change/delete at `src/pages/*`.

## Getting started

### Installation

```shell
pnpm add @generouted/tanstack-react-router @tanstack/react-router@beta
```

Optional additional packages for actions and/or loaders:

```shell
pnpm add @tanstack/react-actions@beta @tanstack/react-loaders@beta
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

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
```

## Examples

### TanStack React Router

- [Basic](../../examples/tanstack-react-router/basic)

## License

MIT
