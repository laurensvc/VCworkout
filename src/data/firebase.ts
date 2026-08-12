import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const firestore = app ? getFirestore(app) : null

if (app && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth!, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(firestore!, '127.0.0.1', 8080)
}

export const approvedUid = import.meta.env.VITE_APPROVED_FIREBASE_UID ?? ''

export async function startGoogleSignIn(): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured.')
  await signInWithRedirect(auth, new GoogleAuthProvider())
}

export async function endSession(): Promise<void> {
  if (auth) await signOut(auth)
}
