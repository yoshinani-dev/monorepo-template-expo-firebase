import "server-only"

import { initialize } from "@repo/features/core/initialize"

import { env } from "~/env"

export function customInitApp() {
  initialize(
    env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    env.GOOGLE_CLIENT_EMAIL,
    env.GOOGLE_PRIVATE_KEY,
  )
}
