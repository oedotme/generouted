import { useLocation } from 'react-router'

import { useModals } from '@/router'

export default function Welcome() {
  const location = useLocation()
  const modals = useModals()

  const handleClose = () => modals.close()

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'grid', placeContent: 'center' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} onClick={handleClose} />
      <div style={{ background: 'white', padding: 40, height: 300, width: 600 }}>
        <h2>Global Modal!</h2>
        <p>Current pathname: {location.pathname}</p>

        <button onClick={() => modals.close()}>Close</button>
        <button onClick={() => modals.close({ at: '/login' })}>Close and redirect to /login</button>
      </div>
    </div>
  )
}
