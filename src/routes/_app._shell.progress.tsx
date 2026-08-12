import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/page-header'
import { ScreenState } from '../components/screen-state'
import { usePerformances } from '../data/queries'

export const Route = createFileRoute('/_app/_shell/progress')({ component: ProgressScreen })

function ProgressScreen() {
  const performances = usePerformances()
  const names = useMemo(() => [...new Set((performances.data ?? []).map((item) => item.exerciseName))].toSorted(), [performances.data])
  const [selectedName, setSelectedName] = useState('')
  const selection = selectedName || names[0] || ''
  const entries = useMemo(() => (performances.data ?? []).filter((item) => item.exerciseName === selection).toSorted((a, b) => a.completedAt.localeCompare(b.completedAt)), [performances.data, selection])
  const heaviest = entries.reduce((best, item) => Math.max(best, item.heaviestWeightKg), 0)
  const bestE1rm = entries.reduce((best, item) => Math.max(best, item.bestEstimatedOneRepMaxKg), 0)
  const totalVolume = entries.reduce((sum, item) => sum + item.totalVolumeKg, 0)

  if (performances.isError) return <ScreenState title="Progress did not load" message="Your records are still protected. Check the connection and try again." action={<button className="primary-button" onClick={() => performances.refetch()}>Retry</button>} />

  return (
    <div>
      <PageHeader title="Progress" description="One exercise at a time, grounded in completed sets." />
      {performances.isPending ? <p className="muted">Calculating progress…</p> : null}
      {names.length === 0 ? <section className="inline-empty"><h2>No trends yet</h2><p>Complete a loaded exercise to begin weight, volume, and estimated 1RM trends.</p></section> : (
        <>
          <div className="field progress-select"><label htmlFor="progress-exercise">Exercise</label><select id="progress-exercise" className="select-input" value={selection} onChange={(event) => setSelectedName(event.target.value)}>{names.map((name) => <option key={name}>{name}</option>)}</select></div>
          <section className="record-panel">
            <div className="record-main"><span>Heaviest</span><strong className="data">{formatKg(heaviest)}</strong></div>
            <div className="record-support"><div><span>Best e1RM</span><strong className="data">{formatKg(bestE1rm)}</strong></div><div><span>Total volume</span><strong className="data">{Math.round(totalVolume).toLocaleString()} kg</strong></div></div>
          </section>
          <section className="chart-section">
            <div className="section-heading"><h2>Estimated 1RM</h2><span>{entries.length} sessions</span></div>
            <ProgressChart values={entries.map((item) => item.bestEstimatedOneRepMaxKg)} labels={entries.map((item) => item.completedAt)} />
          </section>
          <section className="progress-sessions">
            {entries.toReversed().map((item) => <div key={item.id}><time dateTime={item.completedAt}>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(item.completedAt))}</time><span className="data">{item.completedSets} sets</span><strong className="data">{formatKg(item.heaviestWeightKg)}</strong></div>)}
          </section>
        </>
      )}
    </div>
  )
}

function ProgressChart({ values, labels }: { values: number[]; labels: string[] }) {
  if (values.length === 0) return <div className="chart-empty">No eligible loaded sets yet.</div>
  const width = 360
  const height = 170
  const padding = 18
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(1, max - min)
  const points = values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : padding + index * ((width - padding * 2) / (values.length - 1)),
    y: height - padding - ((value - min) / range) * (height - padding * 2),
  }))
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
  return (
    <div className="progress-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Estimated one rep max trend from ${labels[0]} to ${labels.at(-1)}`}>
        <path className="chart-guide" d={`M${padding},${height - padding}H${width - padding}`} />
        <path className="chart-line" d={path} />
        {points.map((point, index) => <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 3} />)}
      </svg>
    </div>
  )
}

function formatKg(value: number) { return `${Math.round(value * 10) / 10} kg` }
