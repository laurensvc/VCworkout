import type { ReactNode } from 'react'

export function ScreenState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <section className="screen-state">
      <div className="state-mark" aria-hidden="true"><span /></div>
      <h1>{title}</h1>
      <p>{message}</p>
      {action}
    </section>
  )
}
