import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RouterContext { queryClient: QueryClient }

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: () => (
    <div className="app-frame"><main className="app-content"><h1>Nothing here</h1><p className="muted">This screen does not exist.</p></main></div>
  ),
})
