import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Icon } from '../components/icon'
import { PageHeader } from '../components/page-header'
import { ScreenState } from '../components/screen-state'
import { useDeleteWorkout, useUpdateWorkout, useWorkouts } from '../data/queries'
import { formatDuration, workoutVolume } from '../domain/calculations'
import type { WorkoutSession } from '../domain/types'

export const Route = createFileRoute('/_app/_shell/history')({ component: HistoryScreen })

function HistoryScreen() {
  const workouts = useWorkouts()
  const updateWorkout = useUpdateWorkout()
  const deleteWorkout = useDeleteWorkout()
  const [editing, setEditing] = useState<WorkoutSession | null>(null)

  if (editing) return <WorkoutEditor workout={editing} onClose={() => setEditing(null)} onSave={async (workout) => { await updateWorkout.mutateAsync(workout); setEditing(null) }} onDelete={async (id) => { await deleteWorkout.mutateAsync(id); setEditing(null) }} />
  if (workouts.isError) return <ScreenState title="History did not load" message="Your saved sessions are still protected. Check the connection and try again." action={<button className="primary-button" onClick={() => workouts.refetch()}>Retry</button>} />

  return (
    <div>
      <PageHeader title="History" description="Every completed session, with corrections when the log needs them." />
      {workouts.isPending ? <p className="muted">Loading history…</p> : null}
      {workouts.data?.length === 0 ? <section className="inline-empty"><h2>No completed sessions</h2><p>Finish your first workout and its sets, volume, and duration will appear here.</p></section> : null}
      <div className="history-list">
        {workouts.data?.map((workout) => {
          const sets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0)
          return (
            <button className="history-entry" key={workout.id} onClick={() => setEditing(workout)}>
              <time dateTime={workout.completedAt}><strong>{new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(workout.completedAt))}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(workout.completedAt))}</span></time>
              <div className="history-copy"><strong>{workout.routineName}</strong><span>{workout.exercises.map((item) => item.exerciseName).slice(0, 3).join(' · ')}</span></div>
              <div className="history-metrics"><span className="data">{sets} sets</span><span className="data">{Math.round(workout.totalVolumeKg).toLocaleString()} kg</span></div>
              <Icon name="chevron" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WorkoutEditor({ workout, onClose, onSave, onDelete }: { workout: WorkoutSession; onClose: () => void; onSave: (workout: WorkoutSession) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [draft, setDraft] = useState(workout)
  const [error, setError] = useState('')
  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weightKg' | 'reps' | 'rir', value: string) => setDraft((current) => ({
    ...current,
    exercises: current.exercises.map((exercise, currentExerciseIndex) => currentExerciseIndex === exerciseIndex ? {
      ...exercise,
      sets: exercise.sets.map((set, currentSetIndex) => currentSetIndex === setIndex ? { ...set, [field]: value === '' ? null : Number(value) } : set),
    } : exercise),
  }))
  const save = async () => {
    const invalid = draft.exercises.some((exercise) => exercise.sets.some((set) => set.completed && (set.weightKg === null || set.weightKg < 0 || !set.reps || set.reps < 1 || (set.rir !== null && (set.rir < 0 || set.rir > 5)))))
    if (invalid) return setError('Completed sets need valid kilograms, reps, and RIR from 0 to 5.')
    const updatedAt = new Date().toISOString()
    setError('')
    try {
      await onSave({ ...draft, updatedAt, totalVolumeKg: workoutVolume(draft.exercises) })
    } catch {
      setError('Corrections were not saved. Your original workout is unchanged; check the connection and retry.')
    }
  }
  const remove = async () => {
    if (!confirm('Delete this workout and recalculate progress?')) return
    setError('')
    try {
      await onDelete(draft.id)
    } catch {
      setError('The workout was not deleted. Nothing changed; check the connection and retry.')
    }
  }
  return (
    <div>
      <div className="editor-header"><button className="icon-button" onClick={onClose} aria-label="Back to history"><Icon name="back" /></button><div><h1>{draft.routineName}</h1><span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(draft.completedAt))} · {formatDuration(draft.durationSeconds)}</span></div></div>
      <div className="history-editor">
        {draft.exercises.map((exercise, exerciseIndex) => (
          <section key={exercise.exerciseId}>
            <h2>{exercise.exerciseName}</h2>
            <div className="history-set-labels"><span>Set</span><span>kg</span><span>Reps</span><span>RIR</span><span>Done</span></div>
            {exercise.sets.map((set, setIndex) => (
              <div className="history-set" key={set.id}>
                <strong>{setIndex + 1}</strong>
                <input inputMode="decimal" value={set.weightKg ?? ''} onChange={(event) => updateSet(exerciseIndex, setIndex, 'weightKg', event.target.value)} aria-label={`${exercise.exerciseName} set ${setIndex + 1} kilograms`} />
                <input inputMode="numeric" value={set.reps ?? ''} onChange={(event) => updateSet(exerciseIndex, setIndex, 'reps', event.target.value)} aria-label={`${exercise.exerciseName} set ${setIndex + 1} reps`} />
                <input inputMode="numeric" value={set.rir ?? ''} onChange={(event) => updateSet(exerciseIndex, setIndex, 'rir', event.target.value)} aria-label={`${exercise.exerciseName} set ${setIndex + 1} RIR`} />
                <button className={set.completed ? 'history-check checked' : 'history-check'} onClick={() => setDraft((current) => ({ ...current, exercises: current.exercises.map((item, itemIndex) => itemIndex === exerciseIndex ? { ...item, sets: item.sets.map((itemSet, index) => index === setIndex ? { ...itemSet, completed: !itemSet.completed, completedAt: !itemSet.completed ? new Date().toISOString() : null } : itemSet) } : item) }))} aria-label={`Toggle completed set ${setIndex + 1}`}><Icon name="check" /></button>
              </div>
            ))}
          </section>
        ))}
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button full" onClick={save}>Save corrections</button>
      <button className="discard-link" onClick={remove}>Delete workout</button>
    </div>
  )
}
