import "server-only"

import { auth } from "firebase-admin"

import { SessionCookiePayload } from "./payload"

import { createCustomToken } from "~/lib/firebase-admin/admin-auth"

export async function createCustomTokenFromUserId(
  userId: string,
  claims: Pick<SessionCookiePayload, "name" | "picture" | "email">,
) {
  return await createCustomToken(auth(), userId, claims)
}
