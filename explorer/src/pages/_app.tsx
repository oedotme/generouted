import { Outlet } from 'react-router'

import { Routes, Container } from '@/components'

const source = import.meta.url

export default function App() {
  return (
    <section className="flex min-h-screen bg-slate-50 text-slate-700">
      <main className="container mx-auto flex min-h-full flex-1 space-x-10 p-8">
        <Routes />
        <Container source={source}>
          <Outlet />
        </Container>
      </main>
    </section>
  )
}
