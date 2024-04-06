import { createRoot } from 'react-dom/client'
import { MemoryRoutes } from '@generouted/react-router'

const container = document.getElementById('app')!
createRoot(container).render(<MemoryRoutes />)
