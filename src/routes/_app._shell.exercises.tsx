import { createFileRoute } from '@tanstack/react-router'
import { useDeferredValue, useState } from 'react'
import { Icon } from '../components/icon'
import { PageHeader } from '../components/page-header'
import { useExercises, useSaveExercise } from '../data/queries'
import type { Equipment, Exercise, MuscleGroup } from '../domain/types'

export const Route = createFileRoute('/_app/_shell/exercises')({ component: ExercisesScreen })

function ExercisesScreen() {
  const exercises = useExercises()
  const saveExercise = useSaveExercise()
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const filtered = exercises.data?.filter((item) => item.name.toLowerCase().includes(deferredSearch) || item.primaryMuscle.toLowerCase().includes(deferredSearch)) ?? []

  return (
    <div>
      <PageHeader title="Exercise library" description="36 essentials plus the movements you add." action={<button className="icon-button accent" onClick={() => setCreating(true)} aria-label="Add custom exercise"><Icon name="plus" /></button>} />
      <div className="search-field"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or muscle" aria-label="Search exercises" /></div>
      {creating ? <CustomExerciseForm onClose={() => setCreating(false)} onSave={async (exercise) => { await saveExercise.mutateAsync(exercise); setCreating(false) }} /> : null}
      <div className="exercise-library">
        {filtered.map((exercise) => (
          <details key={exercise.id} className="exercise-library-row">
            <summary><div><strong>{exercise.name}</strong><span>{exercise.primaryMuscle} · {exercise.equipment}</span></div><Icon name="chevron" /></summary>
            <ol>{exercise.instructions.map((step) => <li key={step}>{step}</li>)}</ol>
          </details>
        ))}
      </div>
    </div>
  )
}

function CustomExerciseForm({ onClose, onSave }: { onClose: () => void; onSave: (exercise: Exercise) => Promise<void> }) {
  const [name, setName] = useState('')
  const [equipment, setEquipment] = useState<Equipment>('Dumbbell')
  const [muscle, setMuscle] = useState<MuscleGroup>('Chest')
  const [instructions, setInstructions] = useState('')
  const submit = async () => {
    if (!name.trim() || !instructions.trim()) return
    const now = new Date().toISOString()
    await onSave({ id: crypto.randomUUID(), name: name.trim(), equipment, primaryMuscle: muscle, instructions: instructions.split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 4), origin: 'custom', archived: false, createdAt: now, updatedAt: now })
  }
  const equipmentOptions: Equipment[] = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell']
  const muscleOptions: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Quadriceps', 'Hamstrings', 'Glutes', 'Biceps', 'Triceps', 'Calves', 'Core']
  return (
    <section className="inline-form">
      <div className="section-heading"><h2>Custom exercise</h2><button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
      <div className="form-stack">
        <div className="field"><label>Name</label><input className="text-input" value={name} onChange={(event) => setName(event.target.value)} /></div>
        <div className="split-fields"><div className="field"><label>Equipment</label><select className="select-input" value={equipment} onChange={(event) => setEquipment(event.target.value as Equipment)}>{equipmentOptions.map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label>Primary muscle</label><select className="select-input" value={muscle} onChange={(event) => setMuscle(event.target.value as MuscleGroup)}>{muscleOptions.map((item) => <option key={item}>{item}</option>)}</select></div></div>
        <div className="field"><label>Steps, one per line</label><textarea className="text-area" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder={'Set your position.\nMove with control.\nReturn to the start.'} /></div>
        <button className="primary-button full" onClick={submit}>Save exercise</button>
      </div>
    </section>
  )
}
