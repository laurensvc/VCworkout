import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '../components/icon'
import { NumericSheet } from '../components/numeric-sheet'
import { ScreenState } from '../components/screen-state'
import { useModalKeyboard } from '../components/use-modal-keyboard'
import { clearLocalDraft, loadLocalDraft, saveLocalDraft } from '../data/local-draft'
import { useActiveWorkout, useClearActiveWorkout, useFinishWorkout, useSaveActiveWorkout, useWorkouts } from '../data/queries'
import { finishDraft, formatDuration, workoutVolume } from '../domain/calculations'
import { compareDrafts } from '../domain/drafts'
import type { CompletedSet, WorkoutDraft } from '../domain/types'

export const Route = createFileRoute('/_app/workout')({ component: WorkoutScreen })

type NumericTarget = { exerciseIndex: number; setIndex: number; field: 'weightKg' | 'reps' | 'rir' }

function WorkoutScreen() {
  const cloud = useActiveWorkout()
  if (cloud.isPending) return <div className="workout-frame"><ScreenState title="Recovering workout" message="Checking this phone and the cloud for your latest set." /></div>
  return <RecoveredWorkout cloudDraft={cloud.data ?? null} />
}

function RecoveredWorkout({ cloudDraft }: { cloudDraft: WorkoutDraft | null }) {
  const history = useWorkouts()
  const saveCloud = useSaveActiveWorkout()
  const { mutate: saveDraft } = saveCloud
  const clearCloud = useClearActiveWorkout()
  const finish = useFinishWorkout()
  const navigate = useNavigate()
  const recovery = useMemo(() => {
    const local = loadLocalDraft()
    const choice = compareDrafts(local, cloudDraft)
    if (choice === 'local') return { draft: local, alternate: cloudDraft }
    if (choice === 'cloud') return { draft: cloudDraft, alternate: local }
    return { draft: local ?? cloudDraft, alternate: null }
  }, [cloudDraft])
  const [draft, setDraft] = useState<WorkoutDraft | null>(() => recovery.draft)
  const [alternate, setAlternate] = useState<WorkoutDraft | null>(() => recovery.alternate)
  const [numericTarget, setNumericTarget] = useState<NumericTarget | null>(null)
  const [showFinish, setShowFinish] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const finishSheetRef = useRef<HTMLElement>(null)
  const closeFinish = useCallback(() => setShowFinish(false), [])
  useModalKeyboard(showFinish, finishSheetRef, closeFinish)

  useEffect(() => {
    if (!draft) return
    saveLocalDraft(draft)
    const timeout = window.setTimeout(() => saveDraft(draft), 450)
    return () => window.clearTimeout(timeout)
  }, [draft, saveDraft])

  useEffect(() => {
    if (!draft?.restEndsAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [draft?.restEndsAt])

  const previousByExercise = useMemo(() => {
    const map = new Map<string, CompletedSet[]>()
    for (const workout of history.data ?? []) {
      for (const exercise of workout.exercises) {
        if (!map.has(exercise.exerciseId)) map.set(exercise.exerciseId, exercise.sets)
      }
    }
    return map
  }, [history.data])

  if (!draft) return <div className="workout-frame"><ScreenState title="No workout in progress" message="Choose a routine from Home to start a new session." action={<button className="primary-button" onClick={() => navigate({ to: '/' })}>Back home</button>} /></div>

  const exercise = draft.exercises[draft.currentExerciseIndex]
  if (!exercise) return <div className="workout-frame"><ScreenState title="This draft is incomplete" message="Cancel it safely and start the routine again." action={<button className="danger-button" onClick={() => cancelWorkout(clearCloud.mutateAsync, navigate)}>Discard draft</button>} /></div>

  const updateDraft = (producer: (current: WorkoutDraft) => WorkoutDraft) => setDraft((current) => {
    if (!current) return current
    const next = producer(current)
    return { ...next, revision: current.revision + 1, updatedAt: new Date().toISOString() }
  })

  const updateSet = (exerciseIndex: number, setIndex: number, patch: Partial<CompletedSet>) => updateDraft((current) => ({
    ...current,
    exercises: current.exercises.map((item, itemIndex) => itemIndex === exerciseIndex ? {
      ...item,
      sets: item.sets.map((set, index) => index === setIndex ? { ...set, ...patch } : set),
    } : item),
  }))

  const completeSet = (setIndex: number) => {
    const set = exercise.sets[setIndex]
    if (!set || set.weightKg === null || set.weightKg < 0 || !set.reps || set.reps < 1 || (set.rir !== null && (set.rir < 0 || set.rir > 5))) return
    const completed = !set.completed
    updateDraft((current) => ({
      ...current,
      restEndsAt: completed && exercise.restSeconds > 0 ? new Date(Date.now() + exercise.restSeconds * 1000).toISOString() : current.restEndsAt,
      exercises: current.exercises.map((item, itemIndex) => itemIndex === current.currentExerciseIndex ? {
        ...item,
        sets: item.sets.map((itemSet, index) => index === setIndex ? { ...itemSet, completed, completedAt: completed ? new Date().toISOString() : null } : itemSet),
      } : item),
    }))
  }

  const setTarget = numericTarget ? draft.exercises[numericTarget.exerciseIndex]?.sets[numericTarget.setIndex] : null
  const remainingSeconds = draft.restEndsAt ? Math.max(0, Math.ceil((new Date(draft.restEndsAt).getTime() - now) / 1000)) : 0
  const completedCount = draft.exercises.reduce((sum, item) => sum + item.sets.filter((set) => set.completed).length, 0)
  const elapsed = Math.max(0, Math.floor((now - new Date(draft.startedAt).getTime()) / 1000))

  const finishWorkout = async () => {
    if (completedCount === 0) return
    const workout = finishDraft(draft)
    await finish.mutateAsync(workout)
    clearLocalDraft()
    await navigate({ to: '/history' })
  }

  return (
    <div className="workout-frame">
      <header className="workout-header">
        <button className="icon-button" onClick={() => navigate({ to: '/' })} aria-label="Leave workout"><Icon name="back" /></button>
        <div><strong>{draft.routineName}</strong><span className="data">{formatDuration(elapsed)}</span></div>
        <button className="finish-link" onClick={() => setShowFinish(true)}>Finish</button>
      </header>

      {alternate ? (
        <aside className="conflict-banner">
          <p>A different saved draft was found.</p>
          <button onClick={() => { const current = draft; setDraft(alternate); setAlternate(current) }}>Use other copy</button>
          <button onClick={() => setAlternate(null)}>Keep this one</button>
        </aside>
      ) : null}

      <div className="workout-status-line">
        <span>Exercise {draft.currentExerciseIndex + 1} / {draft.exercises.length}</span>
        <span className={saveCloud.isError ? 'save-state error' : saveCloud.isPending ? 'save-state pending' : 'save-state'}>{saveCloud.isError ? 'Not synced' : saveCloud.isPending ? 'Saving' : 'Saved'}</span>
      </div>

      <section className="exercise-focus">
        <div className="exercise-heading">
          <div><h1>{exercise.exerciseName}</h1><p>{exercise.sets.length} × {exercise.repMin}–{exercise.repMax} · {exercise.restSeconds}s rest</p></div>
          <details className="instructions-popover"><summary>How</summary><ol>{exercise.instructions.map((step) => <li key={step}>{step}</li>)}</ol></details>
        </div>

        <div className="set-ledger">
          <div className="set-labels"><span>Set</span><span>Previous</span><span>kg</span><span>Reps</span><span>RIR</span><span /></div>
          {exercise.sets.map((set, index) => {
            const previous = previousByExercise.get(exercise.exerciseId)?.[index]
            const valid = set.weightKg !== null && set.weightKg >= 0 && Boolean(set.reps) && (set.rir === null || (set.rir >= 0 && set.rir <= 5))
            return (
              <div className={set.completed ? 'set-row completed' : 'set-row'} key={set.id}>
                <strong>{index + 1}</strong>
                <span className="previous-value data">{previous?.completed ? `${previous.weightKg} × ${previous.reps}` : '—'}</span>
                <button className="number-cell data" onClick={() => setNumericTarget({ exerciseIndex: draft.currentExerciseIndex, setIndex: index, field: 'weightKg' })}>{set.weightKg ?? '—'}</button>
                <button className="number-cell data" onClick={() => setNumericTarget({ exerciseIndex: draft.currentExerciseIndex, setIndex: index, field: 'reps' })}>{set.reps ?? '—'}</button>
                <button className="number-cell data" onClick={() => setNumericTarget({ exerciseIndex: draft.currentExerciseIndex, setIndex: index, field: 'rir' })}>{set.rir ?? '—'}</button>
                <button className="complete-set" disabled={!valid} onClick={() => completeSet(index)} aria-label={set.completed ? `Mark set ${index + 1} incomplete` : `Complete set ${index + 1}`}><Icon name="check" /></button>
              </div>
            )
          })}
        </div>
        <button className="add-set-button" onClick={() => updateDraft((current) => ({ ...current, exercises: current.exercises.map((item, itemIndex) => itemIndex === current.currentExerciseIndex ? { ...item, sets: [...item.sets, { id: crypto.randomUUID(), weightKg: null, reps: null, rir: null, completed: false, completedAt: null }] } : item) }))}><Icon name="plus" /> Add set</button>
      </section>

      <div className="exercise-pager">
        <button className="secondary-button" disabled={draft.currentExerciseIndex === 0} onClick={() => updateDraft((current) => ({ ...current, currentExerciseIndex: current.currentExerciseIndex - 1 }))}><Icon name="back" /> Previous</button>
        <button className="primary-button" disabled={draft.currentExerciseIndex === draft.exercises.length - 1} onClick={() => updateDraft((current) => ({ ...current, currentExerciseIndex: current.currentExerciseIndex + 1 }))}>Next <Icon name="chevron" /></button>
      </div>

      {remainingSeconds > 0 ? (
        <aside className="rest-dock">
          <div className="rest-pulse"><Icon name="timer" /></div>
          <div><span>Resting</span><strong className="data">{formatDuration(remainingSeconds)}</strong></div>
          <button onClick={() => updateDraft((current) => ({ ...current, restEndsAt: null }))}>Skip</button>
        </aside>
      ) : null}

      {saveCloud.isError ? <button className="sync-retry" onClick={() => saveCloud.mutate(draft)}>Retry cloud save</button> : null}

      {numericTarget && setTarget ? (
        <NumericSheet
          label={numericTarget.field === 'weightKg' ? 'Weight (kg)' : numericTarget.field === 'reps' ? 'Reps' : 'RIR'}
          value={setTarget[numericTarget.field]}
          step={numericTarget.field === 'weightKg' ? 2.5 : 1}
          min={0}
          max={numericTarget.field === 'rir' ? 5 : undefined}
          onClose={() => setNumericTarget(null)}
          onConfirm={(value) => { updateSet(numericTarget.exerciseIndex, numericTarget.setIndex, { [numericTarget.field]: value }); setNumericTarget(null) }}
        />
      ) : null}

      {showFinish ? (
        <div className="sheet-backdrop">
          <section ref={finishSheetRef} className="finish-sheet" role="dialog" aria-modal="true" aria-labelledby="finish-title" tabIndex={-1}>
            <div className="sheet-handle" />
            <h2 id="finish-title">Finish this workout?</h2>
            <div className="finish-stats"><div><strong className="data">{completedCount}</strong><span>sets</span></div><div><strong className="data">{Math.round(workoutVolume(draft.exercises)).toLocaleString()}</strong><span>kg volume</span></div><div><strong className="data">{formatDuration(elapsed)}</strong><span>duration</span></div></div>
            {completedCount === 0 ? <p className="error-text">Complete at least one valid set before finishing.</p> : null}
            {finish.isError ? <p className="error-text">The workout was not saved. Your draft is still protected; retry when connected.</p> : null}
            <button className="primary-button full" disabled={completedCount === 0 || finish.isPending} onClick={finishWorkout}>{finish.isPending ? 'Saving workout…' : 'Save workout'}</button>
            <button className="secondary-button full" onClick={closeFinish}>Keep training</button>
            <button className="discard-link" onClick={() => confirm('Discard this workout? Completed sets will not be added to history.') && cancelWorkout(clearCloud.mutateAsync, navigate)}>Discard workout</button>
          </section>
        </div>
      ) : null}
    </div>
  )
}

async function cancelWorkout(clear: () => Promise<unknown>, navigate: ReturnType<typeof useNavigate>) {
  await clear()
  clearLocalDraft()
  await navigate({ to: '/' })
}
