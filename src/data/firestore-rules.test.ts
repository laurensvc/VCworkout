// @vitest-environment node
import { readFile } from 'node:fs/promises'
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { afterAll, beforeAll, describe, it } from 'vitest'

let environment: RulesTestEnvironment

describe('Firestore security rules', () => {
  beforeAll(async () => {
    const rules = (await readFile('firestore.rules', 'utf8')).replace('REPLACE_WITH_APPROVED_UID', 'approved-user')
    environment = await initializeTestEnvironment({ projectId: 'vc-workout-test', firestore: { rules } })
  })
  afterAll(async () => environment.cleanup())

  it('allows only the approved user in their own subtree', async () => {
    const approved = environment.authenticatedContext('approved-user').firestore()
    await assertSucceeds(setDoc(doc(approved, 'users/approved-user/settings/app'), { units: 'kg' }))
    await assertSucceeds(getDoc(doc(approved, 'users/approved-user/settings/app')))

    const other = environment.authenticatedContext('other-user').firestore()
    await assertFails(getDoc(doc(other, 'users/approved-user/settings/app')))
    await assertFails(setDoc(doc(other, 'users/other-user/settings/app'), { units: 'kg' }))

    const anonymous = environment.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(anonymous, 'users/approved-user/settings/app')))
  })
})
