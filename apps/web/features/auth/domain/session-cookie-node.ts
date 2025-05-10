import "server-only"

import { auth } from "firebase-admin"

import { SESSION_COOKIE_MAX_AGE_SEC } from "./session-cookie"

import type {
  FirebaseIdToken,
  SessionCookie,
} from "~/lib/firebase-admin/admin-auth"
import * as adminAuth from "~/lib/firebase-admin/admin-auth"
import { customInitApp } from "~/lib/firebase-admin/config"

customInitApp()

export function createSessionCookie(firebaseIdToken: FirebaseIdToken) {
  return adminAuth.createSessionCookie(auth(), firebaseIdToken, {
    expiresIn: SESSION_COOKIE_MAX_AGE_SEC * 1000,
  })
}

export function checkSessionCookieRevoked(sessionCookie: SessionCookie) {
  return adminAuth.verifySessionCookie(auth(), sessionCookie, true)
}
