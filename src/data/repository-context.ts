import { createContext, useContext } from 'react'
import type { WorkoutRepository } from './repository'

export const RepositoryContext = createContext<WorkoutRepository | null>(null)

export function useRepository(): WorkoutRepository {
  const repository = useContext(RepositoryContext)
  if (!repository) throw new Error('Workout repository is unavailable.')
  return repository
}
