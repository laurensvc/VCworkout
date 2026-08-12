import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('creates a routine and starts a recoverable workout', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Ready when/ })).toBeVisible()
  await page.getByRole('link', { name: 'Routines' }).click()
  await page.getByRole('button', { name: 'Create first routine' }).click()
  await page.getByLabel('Routine name').fill('Push day')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('button', { name: 'Save routine' }).click()
  await expect(page.getByText('Push day')).toBeVisible()
  await page.getByRole('button', { name: /Start workout/ }).click()
  await expect(page.getByText('Exercise 1 / 1')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Exercise 1 / 1')).toBeVisible()
})

test('mobile shell exposes all primary destinations', async ({ page }) => {
  for (const name of ['Home', 'Routines', 'History', 'Progress']) {
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible()
  }
})

test('logs a set, finishes the workout, and updates history and progress', async ({ page }) => {
  await page.getByRole('link', { name: 'Routines', exact: true }).click()
  await page.getByRole('button', { name: 'Create first routine' }).click()
  await page.getByLabel('Routine name').fill('Strength check')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('button', { name: 'Save routine' }).click()
  await page.getByRole('button', { name: /Start workout/ }).click()

  await page.locator('.number-cell').nth(0).click()
  await page.getByRole('textbox', { name: 'Weight (kg)' }).fill('100')
  await page.getByRole('button', { name: 'Set weight (kg)' }).click()
  await page.locator('.number-cell').nth(1).click()
  await page.getByRole('textbox', { name: 'Reps' }).fill('5')
  await page.getByRole('button', { name: 'Set reps' }).click()
  await page.locator('.number-cell').nth(2).click()
  await page.getByRole('textbox', { name: 'RIR' }).fill('2')
  await page.getByRole('button', { name: 'Set rir' }).click()
  await page.getByRole('button', { name: 'Complete set 1' }).click()
  await expect(page.getByText('Resting')).toBeVisible()

  await page.getByRole('button', { name: 'Finish' }).click()
  await page.getByRole('button', { name: 'Save workout' }).click()
  await expect(page.getByRole('heading', { name: 'History' })).toBeVisible()
  await expect(page.getByText('Strength check')).toBeVisible()
  await page.getByRole('link', { name: 'Progress', exact: true }).click()
  await expect(page.getByText('100 kg', { exact: true }).first()).toBeVisible()
})
