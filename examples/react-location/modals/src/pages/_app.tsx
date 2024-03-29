import { Link } from '@tanstack/react-location'

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ margin: 24 }}>
      <header style={{ display: 'flex', gap: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/gallery">Gallery</Link>
      </header>

      <main>{children}</main>
    </section>
  )
}
