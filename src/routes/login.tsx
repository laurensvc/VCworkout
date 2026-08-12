import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../auth/auth-context'

export const Route = createFileRoute('/login')({ component: LoginScreen })

function LoginScreen() {
  const { status, signIn } = useAuth()
  const [error, setError] = useState('')
  if (status === 'authenticated') return <Navigate to="/" />

  const title = status === 'denied' ? 'This account is not approved' : status === 'misconfigured' ? 'Connect Firebase' : 'Your training, uninterrupted'
  const message = status === 'denied'
    ? 'VC Workout is private. Sign in with the Google account configured for this app.'
    : status === 'misconfigured'
      ? 'Add the Firebase and approved UID environment values in Netlify before using the production app.'
      : 'A private strength log built for fast sets, reliable recovery, and clear progress.'

  return (
    <div className="login-screen">
      <div className="login-brand"><span>VC</span><strong>Workout</strong></div>
      <div className="login-copy">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {status !== 'misconfigured' ? (
        <button className="primary-button full" onClick={() => signIn().catch(() => setError('Google sign-in could not start. Try again.'))} disabled={status === 'loading'}>
          {status === 'loading' ? 'Checking access…' : 'Continue with Google'}
        </button>
      ) : null}
      {error ? <p className="error-text">{error}</p> : null}
      <p className="login-footnote">One approved account. No public registration.</p>
    </div>
  )
}
