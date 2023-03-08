import { useLocation } from '@solidjs/router'

import { useModals } from '@/router'

export default function Welcome() {
  const location = useLocation()
  const modals = useModals()

  const handleClose = () => modals.close()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'grid',
        'place-content': 'center',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, 'z-index': -1 }} onClick={handleClose} />
      <div style={{ background: 'white', padding: '40px', height: '300px', width: '600px' }}>
        <h2>Global Modal!</h2>
        <p>Current pathname: {location.pathname}</p>

        <button onClick={() => modals.close()}>Close</button>
        <button onClick={() => modals.close({ at: '/about' })}>Close and redirect to /about</button>
      </div>
    </div>
  )
}
