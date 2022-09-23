import { Link, Outlet } from '@tanstack/react-location'

export default function Home() {
  return (
    <>
      <h1>Home - Modals</h1>
      <Link to="/welcome">Welcome modal →</Link>
      <br />
      <br />
      <Link to="/gallery/1">Gallery Item — 1 →</Link>
      <Outlet />
    </>
  )
}
