import { describe, expect, it, vi } from 'vitest'
import { compareDrafts, createWorkoutDraft } from './drafts'
import type { Exercise, Routine, WorkoutDraft } from './types'

const routine: Routine = { id: 'r1', name: 'Lower', note: '', archived: false, createdAt: '2026-08-12T00:00:00.000Z', updatedAt: '2026-08-12T00:00:00.000Z', exercises: [{ exerciseId: 'squat', exerciseName: 'Squat', targetSets: 3, repMin: 5, repMax: 8, restSeconds: 120 }] }
const exercise: Exercise = { id: 'squat', name: 'Squat', equipment: 'Barbell', primaryMuscle: 'Quadriceps', instructions: ['Brace.', 'Squat.'], origin: 'starter', archived: false, createdAt: '2026-08-12T00:00:00.000Z', updatedAt: '2026-08-12T00:00:00.000Z' }

describe('workout drafts', () => {
  it('snapshots routine and exercise content', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce('00000000-0000-4000-8000-000000000001').mockReturnValue('00000000-0000-4000-8000-000000000002')
    const draft = createWorkoutDraft(routine, [exercise], '2026-08-12T10:00:00.000Z')
    expect(draft.routineName).toBe('Lower')
    expect(draft.exercises[0]).toMatchObject({ exerciseName: 'Squat', instructions: ['Brace.', 'Squat.'], sets: expect.arrayContaining([expect.objectContaining({ completed: false })]) })
    expect(draft.exercises[0]?.sets).toHaveLength(3)
  })

  it('selects the newer divergent draft', () => {
    const base: Omit<WorkoutDraft, 'revision' | 'updatedAt'> = { id: 'w1', routineId: 'r1', routineName: 'Lower', startedAt: '2026-08-12T10:00:00.000Z', currentExerciseIndex: 0, restEndsAt: null, exercises: [] }
    const local = { ...base, revision: 3, updatedAt: '2026-08-12T10:05:00.000Z' } satisfies WorkoutDraft
    const cloud = { ...base, revision: 2, updatedAt: '2026-08-12T10:04:00.000Z' } satisfies WorkoutDraft
    expect(compareDrafts(local, cloud)).toBe('local')
    expect(compareDrafts(local, { ...cloud, revision: 3, updatedAt: local.updatedAt })).toBe('same')
    expect(compareDrafts(null, null)).toBe('none')
  })
})
