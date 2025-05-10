"use server"

import { TaggedError } from "@nakanoaas/tagged-error"
import { createOrGetAccount } from "@repo/features/account/usecase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { type FirebaseIdToken } from "~/lib/firebase-admin/admin-auth"
import { customInitApp } from "~/lib/firebase-admin/config"

import { setSessionCookieToCookie } from "./domain/session-cookie"
import { createSessionCookie } from "./domain/session-cookie-node"

customInitApp()

export async function startSessionAction(
  firebaseIdToken: FirebaseIdToken,
  redirectTo: string | null,
  uid: string,
) {
  await createOrGetAccount(uid)

  const sessionCookie = await createSessionCookie(firebaseIdToken)
  if (sessionCookie instanceof TaggedError) {
    return {
      ok: false,
      tag: sessionCookie.tag,
      message: sessionCookie.message,
    } as const
  }

  setSessionCookieToCookie(await cookies(), sessionCookie)

  const path = redirectTo ? decodeURIComponent(redirectTo) : "/"
  redirect(path)
}
