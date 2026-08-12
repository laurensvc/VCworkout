import { mkdir } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('captures the bounded mobile and centered-desktop review surfaces', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByRole('link', { name: 'Routines', exact: true }).click()
  await page.getByRole('button', { name: 'Create first routine' }).click()
  await page.getByLabel('Routine name').fill('Upper strength')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('button', { name: 'Save routine' }).click()
  await page.getByRole('button', { name: /Start workout/ }).click()

  await page.locator('.number-cell').nth(0).click()
  await page.getByRole('textbox', { name: 'Weight (kg)' }).fill('82.5')
  await page.getByRole('button', { name: 'Set weight (kg)' }).click()
  await page.locator('.number-cell').nth(1).click()
  await page.getByRole('textbox', { name: 'Reps' }).fill('8')
  await page.getByRole('button', { name: 'Set reps' }).click()
  await page.locator('.number-cell').nth(2).click()
  await page.getByRole('textbox', { name: 'RIR' }).fill('2')
  await page.getByRole('button', { name: 'Set rir' }).click()
  await page.getByRole('button', { name: 'Complete set 1' }).click()
  await expect(page.getByText('Resting')).toBeVisible()

  await mkdir('.impeccable/review', { recursive: true })
  await page.screenshot({ path: '.impeccable/review/mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.screenshot({ path: '.impeccable/review/desktop.png', fullPage: true })
})
