import { performanceFromExercise } from '../domain/calculations'
import type {
  Exercise,
  ExercisePerformance,
  Routine,
  UserSettings,
  WorkoutDraft,
  WorkoutSession,
} from '../domain/types'
import { CATALOG_VERSION, STARTER_EXERCISES } from './starter-exercises'
import type { WorkoutRepository } from './repository'

interface LocalDatabase {
  exercises: Exercise[]
  routines: Routine[]
  activeWorkout: WorkoutDraft | null
  workouts: WorkoutSession[]
  performances: ExercisePerformance[]
  settings: UserSettings
}

const KEY = 'vc-workout:preview-database:v1'

function freshDatabase(): LocalDatabase {
  const now = new Date().toISOString()
  return {
    exercises: STARTER_EXERCISES,
    routines: [],
    activeWorkout: null,
    workouts: [],
    performances: [],
    settings: {
      units: 'kg',
      defaultRestSeconds: 90,
      exerciseCatalogVersion: CATALOG_VERSION,
      createdAt: now,
      updatedAt: now,
    },
  }
}

function read(): LocalDatabase {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LocalDatabase) : freshDatabase()
  } catch {
    return freshDatabase()
  }
}

function write(database: LocalDatabase): void {
  localStorage.setItem(KEY, JSON.stringify(database))
}

export class LocalWorkoutRepository implements WorkoutRepository {
  async ensureInitialData(): Promise<void> {
    const database = read()
    const ids = new Set(database.exercises.map((item) => item.id))
    const missing = STARTER_EXERCISES.filter((item) => !ids.has(item.id))
    if (missing.length > 0 || database.settings.exerciseCatalogVersion < CATALOG_VERSION) {
      write({
        ...database,
        exercises: [...database.exercises, ...missing],
        settings: {
          ...database.settings,
          exerciseCatalogVersion: CATALOG_VERSION,
          updatedAt: new Date().toISOString(),
        },
      })
    } else if (!localStorage.getItem(KEY)) {
      write(database)
    }
  }

  async listExercises() { return read().exercises.filter((item) => !item.archived) }
  async saveExercise(exercise: Exercise) {
    const database = read()
    write({ ...database, exercises: upsert(database.exercises, exercise) })
  }
  async listRoutines() { return read().routines.filter((item) => !item.archived) }
  async saveRoutine(routine: Routine) {
    const database = read()
    write({ ...database, routines: upsert(database.routines, routine) })
  }
  async deleteRoutine(routineId: string) {
    const database = read()
    write({ ...database, routines: database.routines.filter((item) => item.id !== routineId) })
  }
  async getActiveWorkout() { return read().activeWorkout }
  async saveActiveWorkout(activeWorkout: WorkoutDraft) {
    write({ ...read(), activeWorkout })
  }
  async clearActiveWorkout() { write({ ...read(), activeWorkout: null }) }
  async listWorkouts() {
    return read().workouts.toSorted((a, b) => b.completedAt.localeCompare(a.completedAt))
  }
  async finishWorkout(workout: WorkoutSession) { this.persistWorkout(workout) }
  async updateWorkout(workout: WorkoutSession) { this.persistWorkout(workout) }
  async deleteWorkout(workoutId: string) {
    const database = read()
    write({
      ...database,
      workouts: database.workouts.filter((item) => item.id !== workoutId),
      performances: database.performances.filter((item) => item.workoutId !== workoutId),
    })
  }
  async listPerformances() { return read().performances }
  async getSettings() { return read().settings }

  private persistWorkout(workout: WorkoutSession) {
    const database = read()
    const replacements = workout.exercises.map((item) => performanceFromExercise(workout, item))
    write({
      ...database,
      activeWorkout: null,
      workouts: upsert(database.workouts, workout),
      performances: [
        ...database.performances.filter((item) => item.workoutId !== workout.id),
        ...replacements,
      ],
    })
  }
}

function upsert<T extends { id: string }>(items: T[], value: T): T[] {
  return [...items.filter((item) => item.id !== value.id), value]
}
