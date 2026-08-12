import { createContext, useContext } from 'react'

export interface AppUser {
  uid: string
  displayName: string
  photoURL: string | null
  preview: boolean
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'denied' | 'misconfigured'

export interface AuthContextValue {
  status: AuthStatus
  user: AppUser | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider.')
  return value
}
