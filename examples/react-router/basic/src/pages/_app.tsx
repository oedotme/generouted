import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Modals } from 'generouted/react-router'

export default function App() {
  const navigate = useNavigate()

  const handleOpen = () => navigate(location.pathname, { state: { modal: '/another-modal' } })

  return (
    <section style={{ margin: 24 }}>
      <header style={{ display: 'flex', gap: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <button onClick={handleOpen}>Modal</button>
      </header>

      <main>
        <Outlet />
      </main>

      <Modals />
    </section>
  )
}
