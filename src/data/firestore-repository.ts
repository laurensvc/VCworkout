import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { performanceFromExercise } from '../domain/calculations'
import type {
  Exercise,
  ExercisePerformance,
  Routine,
  UserSettings,
  WorkoutDraft,
  WorkoutSession,
} from '../domain/types'
import { firestore } from './firebase'
import type { WorkoutRepository } from './repository'
import { CATALOG_VERSION, STARTER_EXERCISES } from './starter-exercises'

export class FirestoreWorkoutRepository implements WorkoutRepository {
  constructor(private readonly uid: string) {
    if (!firestore) throw new Error('Firebase is not configured.')
  }

  async ensureInitialData(): Promise<void> {
    const settingsRef = doc(firestore!, `users/${this.uid}/settings/app`)
    const settingsSnapshot = await getDoc(settingsRef)
    const settings = settingsSnapshot.data() as UserSettings | undefined
    if ((settings?.exerciseCatalogVersion ?? 0) >= CATALOG_VERSION) return

    const batch = writeBatch(firestore!)
    const existingExercises = await Promise.all(STARTER_EXERCISES.map((item) =>
      getDoc(doc(firestore!, `users/${this.uid}/exercises/${item.id}`)),
    ))
    STARTER_EXERCISES.forEach((item, index) => {
      const exerciseRef = doc(firestore!, `users/${this.uid}/exercises/${item.id}`)
      if (!existingExercises[index]?.exists()) batch.set(exerciseRef, item)
    })
    const now = new Date().toISOString()
    batch.set(settingsRef, {
      units: 'kg',
      defaultRestSeconds: 90,
      exerciseCatalogVersion: CATALOG_VERSION,
      createdAt: settings?.createdAt ?? now,
      updatedAt: now,
    } satisfies UserSettings)
    await batch.commit()
  }

  async listExercises() {
    const result = await getDocs(collection(firestore!, `users/${this.uid}/exercises`))
    return result.docs.map((item) => item.data() as Exercise).filter((item) => !item.archived)
  }
  async saveExercise(exercise: Exercise) {
    await setDoc(doc(firestore!, `users/${this.uid}/exercises/${exercise.id}`), exercise)
  }
  async listRoutines() {
    const result = await getDocs(collection(firestore!, `users/${this.uid}/routines`))
    return result.docs.map((item) => item.data() as Routine).filter((item) => !item.archived)
  }
  async saveRoutine(routine: Routine) {
    await setDoc(doc(firestore!, `users/${this.uid}/routines/${routine.id}`), routine)
  }
  async deleteRoutine(routineId: string) {
    await deleteDoc(doc(firestore!, `users/${this.uid}/routines/${routineId}`))
  }
  async getActiveWorkout() {
    const result = await getDoc(doc(firestore!, `users/${this.uid}/activeWorkouts/current`))
    return result.exists() ? (result.data() as WorkoutDraft) : null
  }
  async saveActiveWorkout(draft: WorkoutDraft) {
    await setDoc(doc(firestore!, `users/${this.uid}/activeWorkouts/current`), draft)
  }
  async clearActiveWorkout() {
    await deleteDoc(doc(firestore!, `users/${this.uid}/activeWorkouts/current`))
  }
  async listWorkouts() {
    const result = await getDocs(query(
      collection(firestore!, `users/${this.uid}/workouts`),
      orderBy('completedAt', 'desc'),
    ))
    return result.docs.map((item) => item.data() as WorkoutSession)
  }
  async finishWorkout(workout: WorkoutSession) { await this.persistWorkout(workout, true) }
  async updateWorkout(workout: WorkoutSession) { await this.persistWorkout(workout, false) }
  async deleteWorkout(workoutId: string) {
    const batch = writeBatch(firestore!)
    const workoutRef = doc(firestore!, `users/${this.uid}/workouts/${workoutId}`)
    const snapshot = await getDoc(workoutRef)
    const workout = snapshot.data() as WorkoutSession | undefined
    batch.delete(workoutRef)
    for (const exercise of workout?.exercises ?? []) {
      batch.delete(doc(firestore!, `users/${this.uid}/exercisePerformances/${workoutId}_${exercise.exerciseId}`))
    }
    await batch.commit()
  }
  async listPerformances() {
    const result = await getDocs(collection(firestore!, `users/${this.uid}/exercisePerformances`))
    return result.docs.map((item) => item.data() as ExercisePerformance)
  }
  async getSettings() {
    const result = await getDoc(doc(firestore!, `users/${this.uid}/settings/app`))
    if (!result.exists()) throw new Error('Settings are not initialized.')
    return result.data() as UserSettings
  }

  private async persistWorkout(workout: WorkoutSession, clearActive: boolean) {
    const batch = writeBatch(firestore!)
    batch.set(doc(firestore!, `users/${this.uid}/workouts/${workout.id}`), workout)
    for (const exercise of workout.exercises) {
      const performance = performanceFromExercise(workout, exercise)
      batch.set(
        doc(firestore!, `users/${this.uid}/exercisePerformances/${performance.id}`),
        performance,
      )
    }
    if (clearActive) batch.delete(doc(firestore!, `users/${this.uid}/activeWorkouts/current`))
    await batch.commit()
  }
}
