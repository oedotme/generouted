import { createRoot } from 'react-dom/client';
import { Routes } from '@generouted/react-router';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<Routes />);