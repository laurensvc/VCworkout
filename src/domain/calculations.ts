import type {
  CompletedSet,
  ExercisePerformance,
  WorkoutDraft,
  WorkoutExercise,
  WorkoutSession,
} from './types'

export function isValidCompletedSet(set: CompletedSet): boolean {
  return (
    set.completed &&
    set.weightKg !== null &&
    Number.isFinite(set.weightKg) &&
    set.weightKg >= 0 &&
    set.reps !== null &&
    Number.isInteger(set.reps) &&
    set.reps > 0 &&
    (set.rir === null || (Number.isInteger(set.rir) && set.rir >= 0 && set.rir <= 5))
  )
}

export function setVolume(set: CompletedSet): number {
  return isValidCompletedSet(set) ? (set.weightKg ?? 0) * (set.reps ?? 0) : 0
}

export function estimatedOneRepMax(set: CompletedSet): number {
  if (!isValidCompletedSet(set) || !set.weightKg || !set.reps || set.reps > 12) return 0
  return set.weightKg * (1 + set.reps / 30)
}

export function workoutVolume(exercises: WorkoutExercise[]): number {
  return exercises.reduce(
    (total, exercise) => total + exercise.sets.reduce((sum, set) => sum + setVolume(set), 0),
    0,
  )
}

export function performanceFromExercise(
  workout: WorkoutSession,
  exercise: WorkoutExercise,
): ExercisePerformance {
  const validSets = exercise.sets.filter(isValidCompletedSet)
  let heaviestWeightKg = 0
  let bestEstimatedOneRepMaxKg = 0
  let totalVolumeKg = 0

  for (const set of validSets) {
    heaviestWeightKg = Math.max(heaviestWeightKg, set.weightKg ?? 0)
    bestEstimatedOneRepMaxKg = Math.max(bestEstimatedOneRepMaxKg, estimatedOneRepMax(set))
    totalVolumeKg += setVolume(set)
  }

  return {
    id: `${workout.id}_${exercise.exerciseId}`,
    workoutId: workout.id,
    exerciseId: exercise.exerciseId,
    exerciseName: exercise.exerciseName,
    completedAt: workout.completedAt,
    totalVolumeKg,
    heaviestWeightKg,
    bestEstimatedOneRepMaxKg,
    completedSets: validSets.length,
  }
}

export function finishDraft(draft: WorkoutDraft, completedAt = new Date().toISOString()): WorkoutSession {
  const durationSeconds = Math.max(
    0,
    Math.round((new Date(completedAt).getTime() - new Date(draft.startedAt).getTime()) / 1000),
  )

  return {
    id: draft.id,
    routineId: draft.routineId,
    routineName: draft.routineName,
    startedAt: draft.startedAt,
    updatedAt: completedAt,
    completedAt,
    durationSeconds,
    currentExerciseIndex: draft.currentExerciseIndex,
    exercises: draft.exercises,
    totalVolumeKg: workoutVolume(draft.exercises),
  }
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
