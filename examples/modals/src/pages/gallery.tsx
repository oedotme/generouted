import { Link, Outlet } from '@tanstack/react-location'

const timestamps = [...Array(8)].map((_, index) => index + 1)

export default function Gallery() {
  return (
    <>
      <h1>Gallery - Modals</h1>
      <ul>
        {timestamps.map((timestamp) => (
          <li key={timestamp}>
            <Link to={`/gallery/${timestamp}`}>Item — {timestamp} →</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  )
}
