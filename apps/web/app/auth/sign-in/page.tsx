import { Suspense } from "react"

import { SignInForm } from "./_components"

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  )
}
