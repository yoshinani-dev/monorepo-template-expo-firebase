import "server-only"

import { TaggedError } from "@nakanoaas/tagged-error"
import type { Auth, SessionCookieOptions } from "firebase-admin/auth"
import { FirebaseAuthError } from "firebase-admin/auth"
import type { Tagged } from "type-fest"

export type FirebaseCustomToken = Tagged<string, "FirebaseCustomToken">
export type FirebaseIdToken = Tagged<string, "FirebaseIdToken">
export type SessionCookie = Tagged<string, "SessionCookie">

export async function createCustomToken(
  auth: Auth,
  uid: string,
  developerClaims?: object,
) {
  try {
    const customToken = await auth.createCustomToken(uid, developerClaims)
    return customToken as FirebaseCustomToken
  } catch (e) {
    if (!(e instanceof FirebaseAuthError)) {
      return new TaggedError("CREATE_CUSTOM_TOKEN_UNKNOWN_ERROR", {
        cause: e,
      })
    }

    if (e.code === "auth/argument-error") {
      return new TaggedError("CREATE_CUSTOM_TOKEN_ARGUMENT_ERROR", {
        cause: e,
      })
    }

    if (e.code === "auth/invalid-uid") {
      return new TaggedError("CREATE_CUSTOM_TOKEN_INVALID_UID", {
        cause: e,
      })
    }

    return new TaggedError("CREATE_CUSTOM_TOKEN_UNKNOWN_FIREBASE_ERROR", {
      cause: e,
    })
  }
}

export async function createSessionCookie(
  auth: Auth,
  firebaseIdToken: FirebaseIdToken,
  options: SessionCookieOptions,
) {
  try {
    const result = await auth.createSessionCookie(firebaseIdToken, options)
    return result as SessionCookie
  } catch (e) {
    if (!(e instanceof FirebaseAuthError)) {
      return new TaggedError("CREATE_SESSION_COOKIE_UNKNOWN_ERROR", {
        cause: e,
      })
    }

    if (e.code === "auth/invalid-id-token") {
      return new TaggedError("CREATE_SESSION_COOKIE_INVALID_ID_TOKEN", {
        cause: e,
      })
    }

    if (e.code === "auth/session-cookie-already-expired") {
      return new TaggedError("CREATE_SESSION_COOKIE_ALREADY_EXPIRED", {
        cause: e,
      })
    }

    if (e.code === "auth/maximum-session-length-exceeded") {
      return new TaggedError(
        "CREATE_SESSION_COOKIE_MAXIMUM_SESSION_LENGTH_EXCEEDED",
        {
          cause: e,
        },
      )
    }

    return new TaggedError("CREATE_SESSION_COOKIE_UNKNOWN_FIREBASE_ERROR", {
      cause: e,
    })
  }
}

export function verifyIdToken(auth: Auth, idToken: FirebaseIdToken) {
  try {
    return auth.verifyIdToken(idToken)
  } catch (e) {
    if (!(e instanceof FirebaseAuthError)) {
      return new TaggedError("VERIFY_ID_TOKEN_UNKNOWN_ERROR", {
        cause: e,
      })
    }

    if (e.code === "auth/id-token-expired") {
      return new TaggedError("VERIFY_ID_TOKEN_EXPIRED", {
        cause: e,
      })
    }

    if (e.code === "auth/id-token-revoked") {
      return new TaggedError("VERIFY_ID_TOKEN_REVOKED", {
        cause: e,
      })
    }

    return new TaggedError("VERIFY_ID_TOKEN_UNKNOWN_FIREBASE_ERROR", {
      cause: e,
    })
  }
}

export function verifySessionCookie(
  auth: Auth,
  sessionCookie: SessionCookie,
  checkRevoked?: boolean,
) {
  try {
    return auth.verifySessionCookie(sessionCookie, checkRevoked)
  } catch (e) {
    if (!(e instanceof FirebaseAuthError)) {
      return new TaggedError("VERIFY_SESSION_COOKIE_UNKNOWN_ERROR", {
        cause: e,
      })
    }

    if (e.code === "auth/invalid-id-token") {
      return new TaggedError("VERIFY_SESSION_COOKIE_INVALID_ID_TOKEN", {
        cause: e,
      })
    }

    if (e.code === "auth/session-cookie-already-expired") {
      return new TaggedError("VERIFY_SESSION_COOKIE_ALREADY_EXPIRED", {
        cause: e,
      })
    }

    if (e.code === "auth/maximum-session-length-exceeded") {
      return new TaggedError(
        "VERIFY_SESSION_COOKIE_MAXIMUM_SESSION_LENGTH_EXCEEDED",
        {
          cause: e,
        },
      )
    }

    return new TaggedError("VERIFY_SESSION_COOKIE_UNKNOWN_FIREBASE_ERROR", {
      cause: e,
    })
  }
}
