import type { Exercise, Routine, WorkoutDraft } from './types'

export function createWorkoutDraft(
  routine: Routine,
  exercises: Exercise[],
  now = new Date().toISOString(),
): WorkoutDraft {
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]))

  return {
    id: crypto.randomUUID(),
    routineId: routine.id,
    routineName: routine.name,
    startedAt: now,
    updatedAt: now,
    revision: 1,
    currentExerciseIndex: 0,
    restEndsAt: null,
    exercises: routine.exercises.map((item) => {
      const exercise = exerciseMap.get(item.exerciseId)
      return {
        exerciseId: item.exerciseId,
        exerciseName: item.exerciseName,
        instructions: exercise?.instructions ?? [],
        repMin: item.repMin,
        repMax: item.repMax,
        restSeconds: item.restSeconds,
        sets: Array.from({ length: item.targetSets }, () => ({
          id: crypto.randomUUID(),
          weightKg: null,
          reps: null,
          rir: null,
          completed: false,
          completedAt: null,
        })),
      }
    }),
  }
}

export type DraftChoice = 'local' | 'cloud' | 'same' | 'none'

export function compareDrafts(
  local: WorkoutDraft | null,
  cloud: WorkoutDraft | null,
): DraftChoice {
  if (!local && !cloud) return 'none'
  if (local && !cloud) return 'local'
  if (!local && cloud) return 'cloud'
  if (!local || !cloud) return 'none'
  if (local.id === cloud.id && local.revision === cloud.revision) return 'same'
  return new Date(local.updatedAt).getTime() >= new Date(cloud.updatedAt).getTime()
    ? 'local'
    : 'cloud'
}
