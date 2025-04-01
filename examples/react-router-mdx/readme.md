# Generouted + React Router + MDX Example

## What's different from the default setup of [react-router example](/examples/react-router)

- `@mdx-js/rollup` installation and config at `vite.config.ts` to use `.mdx` files at `src/pages`:

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'
import mdx from '@mdx-js/rollup'

export default defineConfig({ plugins: [{ enforce: 'pre', ...mdx() }, react(), generouted.vite()] })
```

## Adding pages

Add the home page by creating a new file `src/pages/index.mdx` → `/`:

```mdx
### Header

**Bold**, _italic_ and `inline-code`
```

## Preview

Run this example online via [StackBlitz](https://stackblitz.com/github.com/oedotme/generouted/tree/main/examples/react-router-mdx):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github.com/oedotme/generouted/tree/main/examples/react-router-mdx)
