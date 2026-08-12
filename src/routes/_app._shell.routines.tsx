import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Icon } from '../components/icon'
import { PageHeader } from '../components/page-header'
import { saveLocalDraft } from '../data/local-draft'
import { useDeleteRoutine, useExercises, useRoutines, useSaveActiveWorkout, useSaveRoutine } from '../data/queries'
import { createWorkoutDraft } from '../domain/drafts'
import type { Exercise, Routine, RoutineExercise } from '../domain/types'

export const Route = createFileRoute('/_app/_shell/routines')({ component: RoutinesScreen })

function RoutinesScreen() {
  const routines = useRoutines()
  const exercises = useExercises()
  const saveRoutine = useSaveRoutine()
  const deleteRoutine = useDeleteRoutine()
  const saveActive = useSaveActiveWorkout()
  const navigate = useNavigate()
  const [editing, setEditing] = useState<Routine | null>(null)

  if (editing && exercises.data) {
    return <RoutineEditor routine={editing} exercises={exercises.data} onClose={() => setEditing(null)} onSave={async (routine) => {
      await saveRoutine.mutateAsync(routine)
      setEditing(null)
    }} />
  }

  const createRoutine = () => {
    const now = new Date().toISOString()
    setEditing({ id: crypto.randomUUID(), name: '', note: '', exercises: [], archived: false, createdAt: now, updatedAt: now })
  }

  const startRoutine = async (routine: Routine) => {
    if (!exercises.data) return
    const draft = createWorkoutDraft(routine, exercises.data)
    saveLocalDraft(draft)
    await saveActive.mutateAsync(draft)
    await navigate({ to: '/workout' })
  }

  return (
    <div>
      <PageHeader title="Routines" description="Reusable plans that stay flexible once training begins." action={<button className="icon-button accent" onClick={createRoutine} aria-label="Create routine"><Icon name="plus" /></button>} />
      {routines.isPending || exercises.isPending ? <p className="muted">Loading routines…</p> : null}
      {routines.data?.length === 0 ? (
        <section className="inline-empty">
          <h2>No routines yet</h2>
          <p>Choose exercises, targets, and rest once. Adjust the actual sets as you train.</p>
          <button className="primary-button" onClick={createRoutine}><Icon name="plus" /> Create first routine</button>
        </section>
      ) : (
        <div className="routine-list">
          {routines.data?.map((routine) => (
            <article className="routine-row" key={routine.id}>
              <button className="routine-main" onClick={() => setEditing(routine)}>
                <strong>{routine.name}</strong>
                <span>{routine.exercises.length} exercises · {routine.exercises.reduce((sum, item) => sum + item.targetSets, 0)} working sets</span>
                <small>{routine.exercises.slice(0, 4).map((item) => item.exerciseName).join(' · ')}</small>
              </button>
              <div className="row-actions">
                <button className="icon-button" onClick={() => setEditing(routine)} aria-label={`Edit ${routine.name}`}><Icon name="edit" /></button>
                <button className="icon-button danger" onClick={() => confirm(`Delete ${routine.name}?`) && deleteRoutine.mutate(routine.id)} aria-label={`Delete ${routine.name}`}><Icon name="trash" /></button>
              </div>
              <button className="primary-button full" onClick={() => startRoutine(routine)} disabled={saveActive.isPending}><Icon name="play" /> Start workout</button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function RoutineEditor({ routine, exercises, onClose, onSave }: { routine: Routine; exercises: Exercise[]; onClose: () => void; onSave: (routine: Routine) => Promise<void> }) {
  const [name, setName] = useState(routine.name)
  const [note, setNote] = useState(routine.note)
  const [items, setItems] = useState<RoutineExercise[]>(routine.exercises)
  const [selected, setSelected] = useState(exercises[0]?.id ?? '')
  const [error, setError] = useState('')
  const available = useMemo(() => exercises.filter((exercise) => !items.some((item) => item.exerciseId === exercise.id)), [exercises, items])

  const add = () => {
    const item = exercises.find((exercise) => exercise.id === selected) ?? available[0]
    if (!item) return
    setItems((current) => [...current, { exerciseId: item.id, exerciseName: item.name, targetSets: 3, repMin: 8, repMax: 12, restSeconds: 90 }])
    setSelected(available.find((exercise) => exercise.id !== item.id)?.id ?? '')
  }

  const update = (index: number, next: Partial<RoutineExercise>) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...next } : item))
  const save = async () => {
    if (!name.trim()) return setError('Name the routine.')
    if (items.length === 0) return setError('Add at least one exercise.')
    if (items.some((item) => item.targetSets < 1 || item.targetSets > 10 || item.repMin < 1 || item.repMax < item.repMin || item.restSeconds < 0 || item.restSeconds > 600)) return setError('Check set, rep, and rest targets.')
    setError('')
    await onSave({ ...routine, name: name.trim(), note: note.trim(), exercises: items, updatedAt: new Date().toISOString() })
  }

  return (
    <div>
      <div className="editor-header"><button className="icon-button" onClick={onClose} aria-label="Close editor"><Icon name="back" /></button><h1>{routine.name ? 'Edit routine' : 'New routine'}</h1></div>
      <div className="form-stack">
        <div className="field"><label htmlFor="routine-name">Routine name</label><input id="routine-name" className="text-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Upper body" /></div>
        <div className="field"><label htmlFor="routine-note">Note</label><textarea id="routine-note" className="text-area" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional focus or cue" /></div>
      </div>
      <section className="editor-section">
        <h2>Exercises</h2>
        <div className="exercise-editor-list">
          {items.map((item, index) => (
            <article className="exercise-editor-row" key={item.exerciseId}>
              <div className="editor-row-title"><strong>{item.exerciseName}</strong><button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${item.exerciseName}`}><Icon name="close" /></button></div>
              <div className="target-grid">
                <label>Sets<input inputMode="numeric" value={item.targetSets} onChange={(event) => update(index, { targetSets: Number(event.target.value) })} /></label>
                <label>Min reps<input inputMode="numeric" value={item.repMin} onChange={(event) => update(index, { repMin: Number(event.target.value) })} /></label>
                <label>Max reps<input inputMode="numeric" value={item.repMax} onChange={(event) => update(index, { repMax: Number(event.target.value) })} /></label>
                <label>Rest sec<input inputMode="numeric" value={item.restSeconds} onChange={(event) => update(index, { restSeconds: Number(event.target.value) })} /></label>
              </div>
            </article>
          ))}
        </div>
        {available.length > 0 ? <div className="add-exercise"><select className="select-input" value={selected || available[0]?.id} onChange={(event) => setSelected(event.target.value)}>{available.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}</select><button className="secondary-button" onClick={add}><Icon name="plus" /> Add</button></div> : null}
      </section>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button full" onClick={save}>Save routine</button>
    </div>
  )
}
