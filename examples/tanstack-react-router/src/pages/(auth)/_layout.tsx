import { Outlet } from '@tanstack/router'

export default function Layout() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  )
}
