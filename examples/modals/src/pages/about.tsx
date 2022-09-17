import { Link, Outlet } from '@tanstack/react-location'

export default function About() {
  return (
    <>
      <h1>About - Modals</h1>
      <Link to="/about/location">Location →</Link>
      <Outlet />
    </>
  )
}
