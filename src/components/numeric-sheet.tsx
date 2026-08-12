import { useEffect, useRef, useState } from 'react'
import { Icon } from './icon'
import { useModalKeyboard } from './use-modal-keyboard'

export function NumericSheet({
  label,
  value,
  step = 1,
  min = 0,
  max,
  onClose,
  onConfirm,
}: {
  label: string
  value: number | null
  step?: number
  min?: number
  max?: number
  onClose: () => void
  onConfirm: (value: number) => void
}) {
  const [draft, setDraft] = useState(value?.toString() ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  useModalKeyboard(true, dialogRef, onClose)
  useEffect(() => inputRef.current?.focus(), [])
  const numeric = Number(draft)
  const valid = draft !== '' && Number.isFinite(numeric) && numeric >= min && (max === undefined || numeric <= max)

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section ref={dialogRef} className="numeric-sheet" role="dialog" aria-modal="true" aria-labelledby="numeric-sheet-title" tabIndex={-1}>
        <div className="sheet-handle" />
        <div className="sheet-heading">
          <h2 id="numeric-sheet-title">{label}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        <div className="number-composer">
          <button onClick={() => setDraft(String(Math.max(min, (Number(draft) || 0) - step)))} aria-label={`Decrease ${label}`}>−</button>
          <input ref={inputRef} inputMode="decimal" value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={label} />
          <button onClick={() => setDraft(String(Math.min(max ?? Infinity, (Number(draft) || 0) + step)))} aria-label={`Increase ${label}`}>+</button>
        </div>
        <button className="primary-button full" disabled={!valid} onClick={() => valid && onConfirm(numeric)}>Set {label.toLowerCase()}</button>
      </section>
    </div>
  )
}
