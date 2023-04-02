import { createRoot } from 'react-dom/client'

import { Routes } from './routes.gen'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
