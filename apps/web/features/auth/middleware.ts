import "server-only"

import { TaggedError } from "@nakanoaas/tagged-error"
import { type NextRequest, NextResponse } from "next/server"

import {
  extractSessionCookie,
  verifySessionCookie,
} from "./domain/session-cookie"

export async function authMiddleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // /auth の場合
  if (req.nextUrl.pathname.startsWith("/auth")) {
    return await authPageMiddleware(req)
  }

  const sessionCookie = extractSessionCookie(req.cookies)
  if (!sessionCookie) {
    console.error("session cookie not found")

    const redirectTo = encodeURIComponent(
      `${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`,
    )
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?error-code=SESSION_COOKIE_NOT_FOUND&redirectTo=${redirectTo}`,
        req.nextUrl,
      ),
    )
  }

  const verifiedPayload = await verifySessionCookie(sessionCookie)
  if (verifiedPayload instanceof TaggedError) {
    console.error(verifiedPayload)

    const redirectTo = encodeURIComponent(
      `${req.nextUrl.pathname}${req.nextUrl.search}${req.nextUrl.hash}`,
    )
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?error-code=${verifiedPayload.tag}&redirectTo=${redirectTo}`,
        req.nextUrl,
      ),
    )
  }

  return NextResponse.next()
}

async function authPageMiddleware(req: NextRequest) {
  // server action の場合はリクエストをそのまま通す
  if (req.headers.has("next-action")) {
    return NextResponse.next()
  }

  const shouldAuthenticate = await checkShouldAuthenticate(req)

  if (shouldAuthenticate) {
    // 認証が必要なときはそのまま通す
    return NextResponse.next()
  } else {
    // 認証が不要なときは/ページにリダイレクト
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }
}

async function checkShouldAuthenticate(req: NextRequest) {
  const sessionCookie = extractSessionCookie(req.cookies)
  if (!sessionCookie) {
    return true
  }

  const verifiedPayload = await verifySessionCookie(sessionCookie)
  if (verifiedPayload instanceof TaggedError) {
    console.error(verifiedPayload)
    return true
  }

  return false
}
