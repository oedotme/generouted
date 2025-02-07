import { Link } from '@/router'
import { Outlet } from 'react-router'

const timestamps = [...Array(8)].map((_, index) => index + 1)

export default function Gallery() {
  return (
    <>
      <h1>Gallery - Modals</h1>
      <ul>
        {timestamps.map((timestamp) => (
          <li key={timestamp}>
            <Link to="/gallery/:id" params={{ id: String(timestamp) }}>
              Item — {timestamp} →
            </Link>
          </li>
        ))}
      </ul>

      <Outlet />
    </>
  )
}
