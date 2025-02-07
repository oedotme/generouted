import { useLocation } from 'react-router'

import { Arrow } from '@/icons'
import { useModals } from '@/router'

export default function Info() {
  const location = useLocation()
  const modals = useModals()

  const handleClose = () => modals.close()

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/25">
      <div className="absolute inset-0 -z-10" onClick={handleClose} />
      <div className="flex h-96 w-full max-w-xl flex-col rounded-lg border border-dashed border-slate-500 bg-white p-10">
        <h2 className="text-2xl font-bold">Generouted Explorer</h2>

        <p className="mt-2 text-sm font-semibold">Interactive playground for file-based routing</p>
        <p className="mt-6 text-sm">
          This playground will help you understand how file-based routing and its conventions work. Any updates you make
          to `src/page` will be reflected on the left sidebar!
        </p>

        <a
          className="mt-8 flex items-center space-x-1 text-sm font-bold underline"
          href="https://stackblitz.com/github.com/oedotme/generouted/tree/main/explorer"
          target="_blank"
        >
          <span>Try it online via StackBlitz</span>
          <Arrow className="h-3.5 -rotate-[135deg]" />
        </a>
        <a
          className="mt-3 flex items-center space-x-1 text-sm font-bold underline"
          href="https://github.com/oedotme/generouted/tree/main/explorer"
          target="_blank"
        >
          <span>Check out the repo</span>
          <Arrow className="h-3.5 -rotate-[135deg]" />
        </a>

        <div className="mt-auto flex justify-end">
          <button className="text-sm font-semibold" onClick={() => modals.close()}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
