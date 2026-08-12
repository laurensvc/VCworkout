import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NumericSheet } from './numeric-sheet'

describe('NumericSheet', () => {
  it('supports quick increments and confirmation', async () => {
    const user = userEvent.setup()
    const confirm = vi.fn()
    render(<NumericSheet label="Weight (kg)" value={100} step={2.5} onClose={() => undefined} onConfirm={confirm} />)
    expect(screen.getByRole('textbox', { name: 'Weight (kg)' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Increase Weight (kg)' }))
    await user.click(screen.getByRole('button', { name: 'Set weight (kg)' }))
    expect(confirm).toHaveBeenCalledWith(102.5)
  })

  it('prevents values above the configured maximum', async () => {
    const user = userEvent.setup()
    render(<NumericSheet label="RIR" value={5} max={5} onClose={() => undefined} onConfirm={() => undefined} />)
    await user.click(screen.getByRole('button', { name: 'Increase RIR' }))
    expect(screen.getByRole('textbox', { name: 'RIR' })).toHaveValue('5')
  })

  it('dismisses with Escape', async () => {
    const user = userEvent.setup()
    const close = vi.fn()
    render(<NumericSheet label="Reps" value={8} onClose={close} onConfirm={() => undefined} />)

    await user.keyboard('{Escape}')

    expect(close).toHaveBeenCalledOnce()
  })
})
