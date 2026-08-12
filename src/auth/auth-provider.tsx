import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { AuthContext, type AppUser, type AuthStatus } from './auth-context'
import {
  approvedUid,
  auth,
  endSession,
  isFirebaseConfigured,
  startGoogleSignIn,
} from '../data/firebase'

const previewUser: AppUser = {
  uid: 'local-preview-user',
  displayName: 'Training preview',
  photoURL: null,
  preview: true,
}

export function AuthProvider({ children }: PropsWithChildren) {
  const isPreview = import.meta.env.DEV && !isFirebaseConfigured
  const initialStatus: AuthStatus = isPreview ? 'authenticated' : !isFirebaseConfigured ? 'misconfigured' : 'loading'
  const [status, setStatus] = useState<AuthStatus>(initialStatus)
  const [user, setUser] = useState<AppUser | null>(isPreview ? previewUser : null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setStatus('anonymous')
        return
      }
      if (!approvedUid || firebaseUser.uid !== approvedUid) {
        setUser(null)
        setStatus('denied')
        await endSession()
        return
      }
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName ?? 'Athlete',
        photoURL: firebaseUser.photoURL,
        preview: false,
      })
      setStatus('authenticated')
    })
  }, [])

  const value = useMemo(() => ({
    status,
    user,
    signIn: startGoogleSignIn,
    signOut: async () => {
      if (isPreview) return
      await endSession()
    },
  }), [isPreview, status, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
