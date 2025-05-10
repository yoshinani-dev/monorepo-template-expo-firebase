import "client-only"

import { FirebaseOptions, getApps, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from "firebase/firestore"
import { getStorage } from "firebase/storage"

import { env } from "~/env"

export const firebaseConfig: FirebaseOptions = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function initClientApp() {
  const [app] = getApps()

  if (!app) {
    const firebaseApp = initializeApp(firebaseConfig)

    initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
    })

    // Firestore emulator
    if (env.NEXT_PUBLIC_USE_EMULATOR) {
      const db = getFirestore()
      connectFirestoreEmulator(db, "127.0.0.1", 8080)
      const auth = getAuth()
      connectAuthEmulator(auth, "http://127.0.0.1:9099")
    }

    return firebaseApp
  }

  return app
}

export const firebaseApp = initClientApp()

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
