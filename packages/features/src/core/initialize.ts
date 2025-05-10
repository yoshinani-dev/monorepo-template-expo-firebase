import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"

export function initialize(
  projectId: string,
  clientEmail: string,
  privateKey: string,
) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }

  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig)
  }
}
