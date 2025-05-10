import type { MiddlewareConfig, NextRequest } from "next/server"

import { authMiddleware } from "~/features/auth/middleware"

export async function middleware(req: NextRequest) {
  return await authMiddleware(req)
}

export const config: MiddlewareConfig = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    // "/(api|trpc)(.*)", // APIルートでミドルウェアを実行
  ],
}
