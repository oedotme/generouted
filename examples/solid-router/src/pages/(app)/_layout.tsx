import { Outlet } from '@solidjs/router'

export default function AppLayout() {
  return (
    <>
      <h3>App Layout</h3>
      <Outlet />
    </>
  )
}
