import "server-only"

import { TaggedError } from "@nakanoaas/tagged-error"
import { decodeJwt } from "jose"
import type {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

import { SessionCookiePayload } from "./payload"

import { env } from "~/env"
import { type SessionCookie } from "~/lib/firebase-admin/admin-auth"
import { verifySessionCookie as _verifySessionCookie } from "~/lib/firebase-admin/verify-session-cookie"

export type { SessionCookie }

/**
 * セッショントークンの有効期限
 */
export const SESSION_COOKIE_MAX_AGE_SEC = 86400 * 7 // 7days in seconds
export const SESSION_COOKIE_KEY_NAME = "__session"

export async function verifySessionCookie(token: SessionCookie) {
  const result = await _verifySessionCookie(
    token,
    env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    SESSION_COOKIE_MAX_AGE_SEC,
  )
  if (result instanceof TaggedError) {
    return result
  }

  return {
    sub: result.payload.sub,
    exp: result.payload.exp,
    name: result.payload.name,
    picture: result.payload.picture,
    email: result.payload.email,
  } as SessionCookiePayload
}

export function extractSessionCookie(
  cookies: ReadonlyRequestCookies | RequestCookies,
) {
  const sessionCookie = cookies.get(SESSION_COOKIE_KEY_NAME)?.value
  return sessionCookie as SessionCookie
}

export function setSessionCookieToCookie(
  cookies: ReadonlyRequestCookies | RequestCookies | ResponseCookies,
  sessionCookie: SessionCookie,
) {
  cookies.set({
    name: SESSION_COOKIE_KEY_NAME,
    value: sessionCookie,
    maxAge: SESSION_COOKIE_MAX_AGE_SEC,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  })
}

export function deleteSessionCookieFromCookie(
  cookies: ReadonlyRequestCookies | RequestCookies | ResponseCookies,
) {
  cookies.delete(SESSION_COOKIE_KEY_NAME)
}

export function decodeSessionCookie(sessionCookie: SessionCookie) {
  return decodeJwt<SessionCookiePayload>(sessionCookie)
}
