import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import { ScreenState } from '../components/screen-state'
import { useInitialData } from '../data/queries'

export const Route = createFileRoute('/_app')({ component: ProtectedApp })

function ProtectedApp() {
  const { status } = useAuth()
  if (status === 'loading') return <div className="app-frame"><main className="app-content"><ScreenState title="Checking access" message="Confirming your private training space." /></main></div>
  if (status !== 'authenticated') return <Navigate to="/login" />
  return <InitializeApp />
}

function InitializeApp() {
  const initial = useInitialData()
  if (initial.isPending) return <div className="app-frame"><main className="app-content"><ScreenState title="Preparing your log" message="Loading the exercise library and your settings." /></main></div>
  if (initial.isError) return <div className="app-frame"><main className="app-content"><ScreenState title="Could not load your log" message="Check your connection and retry. Your active local draft has not been removed." action={<button className="primary-button" onClick={() => initial.refetch()}>Retry</button>} /></main></div>
  return <Outlet />
}
