import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  decodeSessionCookie,
  extractSessionCookie,
} from "./domain/session-cookie"

export async function auth() {
  const sessionCookie = extractSessionCookie(await cookies())
  if (!sessionCookie) {
    redirect("/auth")
  }

  const payload = decodeSessionCookie(sessionCookie)
  return {
    userId: payload.sub,
    name: payload.name,
    picture: payload.picture,
    email: payload.email,
  }
}
