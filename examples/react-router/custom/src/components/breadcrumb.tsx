import { Link, useMatches } from 'react-router-dom'
import { Module } from '@/routes/regular'
import { useEffect, useState } from 'react'

const Breadcrumb: React.FunctionComponent = () => {
  const matches = useMatches()
  const [breadcrumbs, setBreadcrumbs] = useState<JSX.Element[]>([])

  const loadBreadcrumbs = async () => {
    const loadedHandle = await Promise.all(
      matches.map(async (match) => ({
        ...match,
        handle: (await match.handle) as Module,
      }))
    )
    const breadcrumbs = loadedHandle
      .filter((loadedBreadcrumb) => Boolean(loadedBreadcrumb?.handle?.Crumb))
      .map((filteredBreadcrumb, index, filteredBreadcrumbs) => {
        const { handle, pathname, params } = filteredBreadcrumb
        const Crumb = handle.Crumb as NonNullable<Module['Crumb']>
        const element = typeof Crumb === 'string' ? Crumb : <Crumb params={params} />
        if (index < filteredBreadcrumbs.length - 1) {
          return <Link to={pathname}>{element}</Link>
        } else {
          return <span>{element}</span>
        }
      })
    setBreadcrumbs(breadcrumbs)
  }

  useEffect(() => {
    loadBreadcrumbs()
  }, [matches])

  const renderBreadcrumb = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return null
    }
    return (
      <span>
        {breadcrumbs.length > 0 && (
          <span>
            <Link to={'/'}>Home</Link>/
          </span>
        )}
        {breadcrumbs.map((Breadcrumb, i) => {
          return (
            <span key={i}>
              {Breadcrumb}
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          )
        })}
      </span>
    )
  }

  return <>{renderBreadcrumb()}</>
}

export default Breadcrumb
