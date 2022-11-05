import { Link, Outlet } from '@tanstack/react-location'

export const Loader = () => {
  return Promise.resolve({ source: 'from `src/pages/posts.tsx` layout data loader' })
}

export default function PostsLayout() {
  return (
    <>
      <h1>Posts Layout</h1>

      <div style={{ padding: 18, border: '1px dashed black' }}>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/posts">Posts Index</Link>
          </li>
          <li>
            <Link to="/posts/1">Post 1</Link>
          </li>
          <li>
            <Link to="/posts/2">Post 2</Link>
          </li>
          <li>
            <Link to="/posts/3">Post 3</Link>
          </li>
        </ul>

        <div style={{ margin: '48px 0' }}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
