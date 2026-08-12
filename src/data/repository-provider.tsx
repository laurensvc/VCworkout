import { useMemo, type PropsWithChildren } from 'react'
import { useAuth } from '../auth/auth-context'
import { FirestoreWorkoutRepository } from './firestore-repository'
import { LocalWorkoutRepository } from './local-repository'
import { RepositoryContext } from './repository-context'

export function RepositoryProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const repository = useMemo(() => {
    if (!user) return null
    return user.preview ? new LocalWorkoutRepository() : new FirestoreWorkoutRepository(user.uid)
  }, [user])

  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>
}
