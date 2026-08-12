import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import { Icon } from '../components/icon'
import { PageHeader } from '../components/page-header'

export const Route = createFileRoute('/_app/_shell/settings')({ component: SettingsScreen })

function SettingsScreen() {
  const { user, signOut } = useAuth()
  return (
    <div>
      <PageHeader title="Settings" description="Private account and training defaults." />
      <section className="account-panel">
        <div className="account-avatar"><Icon name="user" /></div>
        <div><strong>{user?.displayName}</strong><span>{user?.preview ? 'Local preview data' : 'Approved Google account'}</span></div>
      </section>
      <div className="settings-list">
        <Link to="/exercises"><span><Icon name="routine" /> Exercise library</span><Icon name="chevron" /></Link>
        <div><span><Icon name="timer" /> Default rest</span><strong className="data">90 sec</strong></div>
        <div><span><Icon name="progress" /> Units</span><strong>kg</strong></div>
      </div>
      {user?.preview ? <p className="preview-note">Preview mode stores data only in this browser. Add Firebase environment values to use cloud persistence.</p> : <button className="secondary-button full" onClick={signOut}>Sign out</button>}
    </div>
  )
}
