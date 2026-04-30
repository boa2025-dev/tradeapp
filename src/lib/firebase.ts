import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

export const FIREBASE_CONFIGURED = Boolean(apiKey)

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null

if (FIREBASE_CONFIGURED) {
  _app = initializeApp({
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })
  _auth = getAuth(_app)
  _db = getFirestore(_app)
}

export const auth = _auth as Auth
export const db = _db as Firestore
