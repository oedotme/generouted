import { createRoot } from 'react-dom/client'
import { Routes } from 'generouted'

const container = document.getElementById('app')!
const root = createRoot(container)

root.render(<Routes />)
