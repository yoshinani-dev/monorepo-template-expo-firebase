import "server-only"

import { TaggedError } from "@nakanoaas/tagged-error"
import type { DecodedIdToken } from "firebase-admin/auth"
import * as jose from "jose"
import { JWSInvalid, JWTExpired } from "jose/errors"
import type { Tagged } from "type-fest"

const ALGORITHM = "RS256"
const GOOGLE_PUBLIC_KEYS_URL =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys"

type KeyId = Tagged<string, "KeyId">

async function fetchPublicKeys() {
  const res = await fetch(GOOGLE_PUBLIC_KEYS_URL, {
    next: {
      // revalidate: 60 * 60 * 24, // 24hours in seconds
    },
  })
  if (!res.ok) {
    throw new TaggedError("FETCH_PUBLIC_KEYS_FAILED", {
      message: "公開鍵の取得に失敗しました",
    })
  }

  const data = (await res.json()) as unknown
  return data as Record<KeyId, string>
}

type TokenPayload = Pick<
  DecodedIdToken,
  "exp" | "iat" | "aud" | "iss" | "sub" | "auth_time"
>

async function getPublicKey(token: string) {
  const certs = await fetchPublicKeys()
  const header = jose.decodeProtectedHeader(token)

  if (!header.kid) {
    return new TaggedError("NO_KID_FOUND", {
      message: "不明なエラーが発生しました",
    })
  }

  const cert = certs[header.kid as KeyId]
  if (!cert) {
    return new TaggedError("NO_CERTIFICATE_FOUND", {
      message: "不明なエラーが発生しました",
      cause: {
        kid: header.kid,
        certs,
      },
    })
  }

  return jose.importX509(cert, ALGORITHM)
}

export async function verifySessionCookie(
  token: string,
  firebaseProjectId: string,
  maxTokenAgeSec?: number,
) {
  const publicKey = await getPublicKey(token)
  if (publicKey instanceof TaggedError) {
    console.error(publicKey)
    throw new TaggedError("PUBLIC_KEY_FETCH_FAILED", {
      message: "公開鍵の取得に失敗しました",
      cause: publicKey,
    })
  }

  try {
    const result = await jose.jwtVerify<TokenPayload>(token, publicKey, {
      algorithms: [ALGORITHM],
      audience: firebaseProjectId,
      issuer: `https://session.firebase.google.com/${firebaseProjectId}`,
      maxTokenAge: maxTokenAgeSec,
      requiredClaims: ["exp", "sub", "auth_time"],
      clockTolerance: 5, // gcpとの時差を考慮
    })

    return result
  } catch (err) {
    console.error(err)

    if (err instanceof JWSInvalid) {
      return new TaggedError("INVALID_SESSION_COOKIE", {
        message: "セッショントークンが無効です",
        cause: err,
      })
    }

    if (err instanceof JWTExpired) {
      return new TaggedError("EXPIRED_SESSION_COOKIE", {
        message: "セッショントークンが期限切れです",
        cause: err,
      })
    }

    return new TaggedError("UNKNOWN_ERROR", {
      message: "不明なエラーが発生しました",
      cause: err,
    })
  }
}
