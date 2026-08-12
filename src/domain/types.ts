export type Equipment =
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Cable'
  | 'Bodyweight'
  | 'Kettlebell'

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Quadriceps'
  | 'Hamstrings'
  | 'Glutes'
  | 'Biceps'
  | 'Triceps'
  | 'Calves'
  | 'Core'

export interface Exercise {
  id: string
  name: string
  equipment: Equipment
  primaryMuscle: MuscleGroup
  instructions: string[]
  origin: 'starter' | 'custom'
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface RoutineExercise {
  exerciseId: string
  exerciseName: string
  targetSets: number
  repMin: number
  repMax: number
  restSeconds: number
}

export interface Routine {
  id: string
  name: string
  note: string
  exercises: RoutineExercise[]
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface CompletedSet {
  id: string
  weightKg: number | null
  reps: number | null
  rir: number | null
  completed: boolean
  completedAt: string | null
}

export interface WorkoutExercise {
  exerciseId: string
  exerciseName: string
  instructions: string[]
  repMin: number
  repMax: number
  restSeconds: number
  sets: CompletedSet[]
}

export interface WorkoutDraft {
  id: string
  routineId: string
  routineName: string
  startedAt: string
  updatedAt: string
  revision: number
  currentExerciseIndex: number
  restEndsAt: string | null
  exercises: WorkoutExercise[]
}

export interface WorkoutSession extends Omit<WorkoutDraft, 'revision' | 'restEndsAt'> {
  completedAt: string
  durationSeconds: number
  totalVolumeKg: number
}

export interface ExercisePerformance {
  id: string
  workoutId: string
  exerciseId: string
  exerciseName: string
  completedAt: string
  totalVolumeKg: number
  heaviestWeightKg: number
  bestEstimatedOneRepMaxKg: number
  completedSets: number
}

export interface UserSettings {
  units: 'kg'
  defaultRestSeconds: number
  exerciseCatalogVersion: number
  createdAt: string
  updatedAt: string
}
