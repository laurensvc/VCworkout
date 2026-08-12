import { describe, expect, it } from 'vitest'
import { estimatedOneRepMax, finishDraft, isValidCompletedSet, performanceFromExercise, workoutVolume } from './calculations'
import type { CompletedSet, WorkoutDraft } from './types'

const completedSet: CompletedSet = { id: 'set-1', weightKg: 100, reps: 5, rir: 2, completed: true, completedAt: '2026-08-12T10:02:00.000Z' }

describe('workout calculations', () => {
  it('validates completed set constraints', () => {
    expect(isValidCompletedSet(completedSet)).toBe(true)
    expect(isValidCompletedSet({ ...completedSet, reps: 0 })).toBe(false)
    expect(isValidCompletedSet({ ...completedSet, rir: 6 })).toBe(false)
    expect(isValidCompletedSet({ ...completedSet, completed: false })).toBe(false)
  })

  it('calculates volume and eligible Epley estimated 1RM', () => {
    expect(workoutVolume([{ exerciseId: 'bench', exerciseName: 'Bench', instructions: [], repMin: 5, repMax: 8, restSeconds: 90, sets: [completedSet] }])).toBe(500)
    expect(estimatedOneRepMax(completedSet)).toBeCloseTo(116.67, 2)
    expect(estimatedOneRepMax({ ...completedSet, reps: 13 })).toBe(0)
  })

  it('finishes a draft and creates deterministic performance metrics', () => {
    const draft: WorkoutDraft = {
      id: 'workout-1', routineId: 'routine-1', routineName: 'Push', startedAt: '2026-08-12T10:00:00.000Z', updatedAt: '2026-08-12T10:02:00.000Z', revision: 3, currentExerciseIndex: 0, restEndsAt: null,
      exercises: [{ exerciseId: 'bench', exerciseName: 'Bench Press', instructions: [], repMin: 5, repMax: 8, restSeconds: 90, sets: [completedSet] }],
    }
    const workout = finishDraft(draft, '2026-08-12T10:30:00.000Z')
    expect(workout.durationSeconds).toBe(1800)
    expect(workout.totalVolumeKg).toBe(500)
    expect(performanceFromExercise(workout, workout.exercises[0]!)).toMatchObject({ id: 'workout-1_bench', completedSets: 1, heaviestWeightKg: 100, totalVolumeKg: 500 })
  })
})
