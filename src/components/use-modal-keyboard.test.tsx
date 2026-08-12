import { useRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useModalKeyboard } from './use-modal-keyboard'

function ModalHarness() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  useModalKeyboard(open, dialogRef, () => setOpen(false))
  return (
    <>
      <button onClick={() => setOpen(true)}>Open finish</button>
      {open ? <section ref={dialogRef} role="dialog" tabIndex={-1}><button>Save workout</button><button>Keep training</button></section> : null}
    </>
  )
}

describe('useModalKeyboard', () => {
  it('moves focus into the modal and restores it after Escape', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)
    const trigger = screen.getByRole('button', { name: 'Open finish' })

    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Save workout' })).toHaveFocus()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
