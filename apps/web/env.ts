import { createEnv } from "@t3-oss/env-nextjs"
import * as v from "valibot"

export const env = createEnv({
  /*
   * サーバーサイドの環境変数です。クライアントでは使用できません。
   * クライアントでこれらの変数にアクセスすると例外がスローされます。
   */
  server: {
    GOOGLE_PRIVATE_KEY: v.string(),
    GOOGLE_CLIENT_EMAIL: v.pipe(v.string(), v.email()),
  },
  /*
   * クライアント（およびサーバー）で使用可能な環境変数です。
   *
   * 💡 これらの変数の前にNEXT_PUBLIC_を付けないと、型エラーが発生します。
   */
  client: {
    NEXT_PUBLIC_FIREBASE_API_KEY: v.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: v.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: v.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: v.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: v.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: v.string(),
    NEXT_PUBLIC_USE_EMULATOR: v.pipe(
      v.optional(v.picklist(["true", "false"]), "false"),
      v.transform((value) => value === "true"),
    ),
  },
  /*
   * Next.jsはEdgeとClientの環境変数をバンドルするため、
   * すべての環境変数がバンドルされるように、手動で環境変数を再構築する必要があります。
   *
   * 💡 `server` と `client` のすべての変数がここに含まれていないと、型エラーが発生します。
   */
  runtimeEnv: {
    // server
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,

    // client
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_USE_EMULATOR: process.env.NEXT_PUBLIC_USE_EMULATOR,
  },
})
