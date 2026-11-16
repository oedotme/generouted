# @generouted/preact-iso

Generated file-based routes for [Preact ISO](https://github.com/preactjs/preact-iso) and [Vite](https://vitejs.dev/)

This package provides a Preact ISO adapter for [Generouted](https://github.com/oedotme/generouted), enabling file-based routing with type safety for Preact applications using preact-iso.

## Installation

```bash
npm install @generouted/preact-iso preact preact-iso
```

## Setup

### 1. Add the plugin to your Vite config

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import generouted from '@generouted/preact-iso/plugin'

export default defineConfig({
  plugins: [preact(), generouted()],
})
```

### 2. Create your main app file

**For eager loading (default):**
```tsx
// src/main.tsx
import { render } from 'preact'
import { Routes } from '@generouted/preact-iso'

render(<Routes />, document.getElementById('app'))
```

**For lazy loading with code-splitting:**
```tsx
// src/main.tsx
import { render } from 'preact'
import { Routes } from '@generouted/preact-iso/lazy'

render(<Routes />, document.getElementById('app'))
```

### 3. Create page files in the `src/pages/` directory

```tsx
// src/pages/index.tsx
export default function Home() {
  return <h1>Home Page</h1>
}

// src/pages/about.tsx
export default function About() {
  return <h1>About Page</h1>
}

// src/pages/users/[id].tsx
export default function User() {
  return <h1>User Page</h1>
}
```

## Usage

### Type-safe routing

After setting up the plugin, Generouted will generate a `src/router.ts` file with type-safe routing utilities:

```tsx
import { Link, useNavigate, useParams } from './router'

// Type-safe Link component
function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/users/123" params={{ id: '123' }}>User 123</Link>
    </nav>
  )
}

// Type-safe navigation hook
function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/users/456', { params: { id: '456' } })
  }
  
  return <button onClick={handleClick}>Go to User 456</button>
}

// Type-safe params hook
function UserPage() {
  const { id } = useParams('/users/[id]')
  return <h1>User ID: {id}</h1>
}
```

## File-based routing conventions

- `src/pages/index.tsx` → `/`
- `src/pages/about.tsx` → `/about`
- `src/pages/users/index.tsx` → `/users`
- `src/pages/users/[id].tsx` → `/users/:id`
- `src/pages/users/[...rest].tsx` → `/users/*`
- `src/pages/_app.tsx` → Root layout
- `src/pages/404.tsx` → Not found page

## Lazy Loading

The lazy version (`@generouted/preact-iso/lazy`) uses preact-iso's built-in `lazy()` function to enable code-splitting and progressive hydration:

- **Code-splitting**: Route components are loaded only when needed
- **Progressive hydration**: When the app hydrates on the client, routes load asynchronously
- **Seamless routing**: Current route stays visible while the next route loads in the background

### Benefits of lazy loading:

1. **Smaller initial bundle**: Only the current route is loaded initially
2. **Better performance**: Reduced initial JavaScript payload
3. **Progressive enhancement**: Routes load as users navigate
4. **Automatic suspense**: preact-iso handles loading states automatically

## Differences from React Router adapter

Since preact-iso has different capabilities compared to react-router, there are some limitations:

1. **Modal routing**: Limited support compared to react-router due to preact-iso's simpler state management
2. **Loaders/Actions**: Not supported in preact-iso
3. **Nested routing**: Simplified compared to react-router's capabilities
4. **Lazy loading**: Uses preact-iso's `lazy()` function instead of React's `React.lazy()`

## Plugin options

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    preact(),
    generouted({
      source: {
        routes: './src/pages/**/[\\w[-]*.{jsx,tsx,mdx}',
        modals: './src/pages/**/[+]*.{jsx,tsx,mdx}'
      },
      output: './src/router.ts',
      format: true
    })
  ],
})
```

## License

MIT 