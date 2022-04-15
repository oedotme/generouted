import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted'

const container = document.getElementById('app')!
createRoot(container).render(<Routes />)
