# Generouted + React Router

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

## Examples

### React Router

- [Plugin](../../examples/react-router/plugin)

## License

MIT
