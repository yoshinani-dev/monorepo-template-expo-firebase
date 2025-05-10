import { getAccount } from "@repo/features/account/usecase"
import { Button } from "@repo/ui/components/button"
import { render } from "@testing-library/react"
import Image, { type ImageProps } from "next/image"

import { auth } from "~/features/auth/server"
import { customInitApp } from "~/lib/firebase-admin/config"

type Props = Omit<ImageProps, "src"> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  )
}

if (import.meta.vitest) {
  const { it, describe } = import.meta.vitest

  describe("ThemeImage", () => {
    it("should render", () => {
      render(
        <ThemeImage
          alt="test"
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          width={180}
          height={38}
        />,
      )
    })
  })
}

customInitApp()

export default async function Home() {
  const user = await auth()
  const account = await getAccount(user.userId)

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Button variant="destructive">Open alert</Button>

        <div className="font-bold">auth</div>
        <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto max-w-full">
          <code className="text-sm whitespace-pre-wrap break-words">
            {JSON.stringify(user, null, 2)}
          </code>
        </pre>
        <div className="font-bold">account</div>
        <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto max-w-full">
          <code className="text-sm whitespace-pre-wrap break-words">
            {JSON.stringify(account, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  )
}
