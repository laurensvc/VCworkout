import type { WorkoutDraft } from '../domain/types'

const STORAGE_KEY = 'vc-workout:active-draft:v1'

export function saveLocalDraft(draft: WorkoutDraft): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function loadLocalDraft(): WorkoutDraft | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return null
    const draft = JSON.parse(value) as WorkoutDraft
    return draft.revision >= 1 && Array.isArray(draft.exercises) ? draft : null
  } catch {
    return null
  }
}

export function clearLocalDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // The cloud copy remains the recovery source when storage is unavailable.
  }
}
