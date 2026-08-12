import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import { Icon, type IconName } from './icon'

const navigation: Array<{ to: '/' | '/routines' | '/history' | '/progress'; label: string; icon: IconName }> = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/routines', label: 'Routines', icon: 'routine' },
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/progress', label: 'Progress', icon: 'progress' },
]

export function AppShell() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div className="app-frame">
      <header className="app-header">
        <Link to="/" className="wordmark" aria-label="VC Workout home">VC</Link>
        <Link to="/settings" className="profile-control" aria-label="Open settings">
          {user?.photoURL ? <img src={user.photoURL} alt="" /> : <Icon name="user" />}
        </Link>
      </header>
      <main className="app-content"><Outlet /></main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
          return (
            <Link key={item.to} to={item.to} className={active ? 'nav-item active' : 'nav-item'}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
