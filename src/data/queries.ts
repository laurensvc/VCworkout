import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Exercise, Routine, WorkoutDraft, WorkoutSession } from '../domain/types'
import { useRepository } from './repository-context'

export const queryKeys = {
  initial: ['initial-data'] as const,
  exercises: ['exercises'] as const,
  routines: ['routines'] as const,
  active: ['active-workout'] as const,
  workouts: ['workouts'] as const,
  performances: ['performances'] as const,
  settings: ['settings'] as const,
}

export function useInitialData() {
  const repository = useRepository()
  return useQuery({
    queryKey: queryKeys.initial,
    queryFn: async () => {
      await repository.ensureInitialData()
      return true
    },
    staleTime: Infinity,
  })
}

export function useExercises() {
  const repository = useRepository()
  return useQuery({ queryKey: queryKeys.exercises, queryFn: () => repository.listExercises() })
}

export function useRoutines() {
  const repository = useRepository()
  return useQuery({ queryKey: queryKeys.routines, queryFn: () => repository.listRoutines() })
}

export function useActiveWorkout() {
  const repository = useRepository()
  return useQuery({ queryKey: queryKeys.active, queryFn: () => repository.getActiveWorkout() })
}

export function useWorkouts() {
  const repository = useRepository()
  return useQuery({ queryKey: queryKeys.workouts, queryFn: () => repository.listWorkouts() })
}

export function usePerformances() {
  const repository = useRepository()
  return useQuery({ queryKey: queryKeys.performances, queryFn: () => repository.listPerformances() })
}

export function useSaveRoutine() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (routine: Routine) => repository.saveRoutine(routine),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.routines }),
  })
}

export function useDeleteRoutine() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repository.deleteRoutine(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.routines }),
  })
}

export function useSaveExercise() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (exercise: Exercise) => repository.saveExercise(exercise),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.exercises }),
  })
}

export function useSaveActiveWorkout() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (draft: WorkoutDraft) => repository.saveActiveWorkout(draft),
    onSuccess: (_, draft) => client.setQueryData(queryKeys.active, draft),
  })
}

export function useClearActiveWorkout() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => repository.clearActiveWorkout(),
    onSuccess: () => client.setQueryData(queryKeys.active, null),
  })
}

export function useFinishWorkout() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (workout: WorkoutSession) => repository.finishWorkout(workout),
    onSuccess: async () => {
      client.setQueryData(queryKeys.active, null)
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.workouts }),
        client.invalidateQueries({ queryKey: queryKeys.performances }),
      ])
    },
  })
}

export function useUpdateWorkout() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (workout: WorkoutSession) => repository.updateWorkout(workout),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.workouts }),
      client.invalidateQueries({ queryKey: queryKeys.performances }),
    ]),
  })
}

export function useDeleteWorkout() {
  const repository = useRepository()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repository.deleteWorkout(id),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.workouts }),
      client.invalidateQueries({ queryKey: queryKeys.performances }),
    ]),
  })
}
