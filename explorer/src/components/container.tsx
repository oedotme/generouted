import { patterns } from '@generouted/react-router/core'

import { Arrow } from '@/icons'
import { classNames } from '@/utils'

type Props = { children?: React.ReactNode; source: string }

export const Container = ({ children, source = '' }: Props) => {
  const file = source.match(/(src\/pages\/.+\.tsx)/)?.[1]

  return (
    <section
      className={classNames(
        'relative h-full flex-1 rounded-lg border border-dashed border-slate-500 p-10 text-sm',
        children ? 'bg-slate-50' : 'bg-white'
      )}
    >
      <span
        className={classNames(
          'absolute -top-3 rounded-md px-3 py-1 text-xs font-medium shadow-sm',
          children ? 'border border-slate-200 bg-white' : 'bg-primary text-white'
        )}
      >
        {file}
      </span>

      {children || (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <ul className="flex space-x-3 font-semibold">
            <div className="flex flex-col justify-between">
              <li className="w-[105px] self-start rounded-l-xl bg-primary px-3 py-2 pl-4 text-white">src/pages</li>
              <li className="w-[105px] self-start rounded-l-xl bg-slate-200 px-3 py-2 pl-4 opacity-50">src/pages</li>
            </div>

            <div className="flex space-x-3">
              {`/${file}`
                ?.replace(...patterns.route)
                .split('/')
                .map((segment, index) => {
                  const result = segment
                    .replace(/^\(\w+\)$/g, '')
                    .replace(...patterns.splat)
                    .replace(...patterns.param)
                    .replace(...patterns.slash)
                    .replace(...patterns.optional)

                  return (
                    <li key={index} className="flex flex-col">
                      <div className="bg-primary p-2 px-3 text-white">{segment}</div>
                      <span className={classNames('mx-auto mt-5', result ? 'text-primary' : 'text-slate-300')}>
                        <Arrow className="h-7 w-7" />
                      </span>
                      <div
                        className={classNames(
                          'mt-4 h-full p-2 px-3 text-center',
                          result ? 'bg-primary text-white' : 'bg-slate-200 opacity-50'
                        )}
                      >
                        {result || segment}
                      </div>
                    </li>
                  )
                })}
            </div>

            <div className="flex flex-col justify-between">
              <li className="flex w-[105px] self-start">
                <span className="rounded-r-xl bg-primary px-3 py-2 pr-4 text-white">.tsx</span>
              </li>
              <li className="flex w-[105px] self-start">
                <span className="rounded-r-xl bg-slate-200 px-3 py-2 pr-4 opacity-50">.tsx</span>
              </li>
            </div>
          </ul>

          <span className="mt-10">
            <Arrow className="h-9 w-9 text-primary" />
          </span>

          <h4 className="mt-8 flex rounded-xl bg-primary px-4 py-2 font-semibold text-white">
            {`/${file}`
              ?.replace(...patterns.route)
              .split('/')
              .map(
                (segment) =>
                  (segment === 'index' || /^\(\w+\)$/.test(segment) ? '' : '/') +
                  segment
                    .replace(/^\(\w+\)$/g, '')
                    .replace(...patterns.splat)
                    .replace(...patterns.param)
                    .replace(...patterns.slash)
                    .replace(...patterns.optional)
              )
              .join('')}
          </h4>
        </div>
      )}
    </section>
  )
}
