import { Link } from 'react-location'

export default function Index() {
  return (
    <>
      <h1>Posts Index</h1>

      <ul>
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
    </>
  )
}
