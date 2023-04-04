import { render } from 'solid-js/web'
import { Routes, routes } from '@generouted/solid-router'
console.debug(routes)
render(Routes, document.getElementById('app') as HTMLElement)
