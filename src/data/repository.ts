import type {
  Exercise,
  ExercisePerformance,
  Routine,
  UserSettings,
  WorkoutDraft,
  WorkoutSession,
} from '../domain/types'

export interface WorkoutRepository {
  ensureInitialData(): Promise<void>
  listExercises(): Promise<Exercise[]>
  saveExercise(exercise: Exercise): Promise<void>
  listRoutines(): Promise<Routine[]>
  saveRoutine(routine: Routine): Promise<void>
  deleteRoutine(routineId: string): Promise<void>
  getActiveWorkout(): Promise<WorkoutDraft | null>
  saveActiveWorkout(draft: WorkoutDraft): Promise<void>
  clearActiveWorkout(): Promise<void>
  listWorkouts(): Promise<WorkoutSession[]>
  finishWorkout(workout: WorkoutSession): Promise<void>
  updateWorkout(workout: WorkoutSession): Promise<void>
  deleteWorkout(workoutId: string): Promise<void>
  listPerformances(): Promise<ExercisePerformance[]>
  getSettings(): Promise<UserSettings>
}
