import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Icon } from '../components/icon'
import { ScreenState } from '../components/screen-state'
import { useActiveWorkout, useExercises, useRoutines, useSaveActiveWorkout, useWorkouts } from '../data/queries'
import { saveLocalDraft } from '../data/local-draft'
import { createWorkoutDraft } from '../domain/drafts'

export const Route = createFileRoute('/_app/_shell/')({ component: HomeScreen })

function HomeScreen() {
  const routines = useRoutines()
  const exercises = useExercises()
  const active = useActiveWorkout()
  const workouts = useWorkouts()
  const saveActive = useSaveActiveWorkout()
  const navigate = useNavigate()
  const [startError, setStartError] = useState('')

  if (routines.isPending || exercises.isPending || active.isPending || workouts.isPending) {
    return <ScreenState title="Loading your training" message="Bringing routines and recent work into view." />
  }
  if (routines.isError || exercises.isError || active.isError || workouts.isError) {
    return <ScreenState title="Your log did not load" message="Check your connection and try this screen again." action={<button className="primary-button" onClick={() => location.reload()}>Reload</button>} />
  }

  const begin = async (routineId: string) => {
    const routine = routines.data.find((item) => item.id === routineId)
    if (!routine) return
    setStartError('')
    const draft = createWorkoutDraft(routine, exercises.data)
    saveLocalDraft(draft)
    try {
      await saveActive.mutateAsync(draft)
      await navigate({ to: '/workout' })
    } catch {
      setStartError('The workout is protected on this phone, but the cloud save failed. Retry when connected.')
    }
  }

  const lastWorkout = workouts.data[0]
  const completedSets = lastWorkout?.exercises.reduce((sum, item) => sum + item.sets.filter((set) => set.completed).length, 0) ?? 0

  return (
    <div>
      <section className="home-intro">
        <h1>Ready when<br />you are.</h1>
        <p>{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
      </section>

      {active.data ? (
        <Link to="/workout" className="resume-plate">
          <div>
            <span>In progress</span>
            <h2>{active.data.routineName}</h2>
            <p>Exercise {active.data.currentExerciseIndex + 1} of {active.data.exercises.length}</p>
          </div>
          <div className="resume-action"><Icon name="play" /></div>
        </Link>
      ) : routines.data.length > 0 ? (
        <section className="start-plate">
          <div className="start-signal"><span /></div>
          <div>
            <h2>Start a workout</h2>
            <p>Previous sets and targets are ready.</p>
          </div>
          <button className="start-round" onClick={() => begin(routines.data[0]!.id)} aria-label={`Start ${routines.data[0]!.name}`}><Icon name="play" /></button>
        </section>
      ) : null}

      {startError ? <p className="error-text">{startError}</p> : null}

      <section className="content-section">
        <div className="section-heading"><h2>Your routines</h2><Link to="/routines">Manage</Link></div>
        {routines.data.length === 0 ? (
          <div className="empty-strip">
            <p>Build your first routine to start logging.</p>
            <Link to="/routines" className="secondary-button"><Icon name="plus" /> Create routine</Link>
          </div>
        ) : (
          <div className="routine-rail">
            {routines.data.map((routine, index) => (
              <article className={index === 0 ? 'routine-tile primary' : 'routine-tile'} key={routine.id}>
                <button onClick={() => begin(routine.id)} aria-label={`Start ${routine.name}`}>
                  <span>{routine.exercises.length} exercises</span>
                  <strong>{routine.name}</strong>
                  <small>{routine.exercises.slice(0, 3).map((item) => item.exerciseName).join(' · ')}</small>
                  <Icon name="play" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-section last-session">
        <div className="section-heading"><h2>Last session</h2>{lastWorkout ? <Link to="/history">View history</Link> : null}</div>
        {lastWorkout ? (
          <Link to="/history" className="session-line">
            <div><strong>{lastWorkout.routineName}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(lastWorkout.completedAt))}</span></div>
            <div className="session-data"><strong>{completedSets}</strong><span>sets</span></div>
            <div className="session-data"><strong>{Math.round(lastWorkout.totalVolumeKg).toLocaleString()}</strong><span>kg</span></div>
            <Icon name="chevron" />
          </Link>
        ) : <p className="muted">Your first completed workout will appear here.</p>}
      </section>
    </div>
  )
}
