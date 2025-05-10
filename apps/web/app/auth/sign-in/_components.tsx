"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form"
import { Input } from "@repo/ui/components/input"
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import * as v from "valibot"

import { startSessionAction } from "~/features/auth/action"
import { FirebaseIdToken } from "~/lib/firebase-admin/admin-auth"
import { auth } from "~/lib/firebase-client"

const SignInFormSchema = v.object({
  email: v.pipe(
    v.string(),
    v.email("正しいメールアドレスを入力してください。"),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, "パスワードは8文字以上である必要があります。"),
  ),
})

type SignInFormData = v.InferOutput<typeof SignInFormSchema>

export function SignInForm() {
  const form = useForm({
    resolver: valibotResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const idToken =
        (await userCredential.user.getIdToken()) as FirebaseIdToken
      const uid = userCredential.user.uid
      await startSessionAction(idToken, redirectTo, uid)
    } catch (error) {
      console.error("Googleログインエラー:", error)
    }
  }

  async function onSubmit(values: SignInFormData) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      )

      const idToken =
        (await userCredential.user.getIdToken()) as FirebaseIdToken
      const uid = userCredential.user.uid

      const result = await startSessionAction(idToken, redirectTo, uid)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- 一旦
      if (!result.ok) {
        form.setError("root", {
          type: "manual",
          message:
            "サインイン中にエラーが発生しました。もう一度お試しください。",
        })
      }
    } catch (error) {
      console.error("サインインエラー:", error)
      if (error instanceof Error) {
        if (
          error.message.includes("auth/user-not-found") ||
          error.message.includes("auth/wrong-password")
        ) {
          form.setError("email", {
            type: "manual",
            message: "メールアドレスまたはパスワードが正しくありません。",
          })
          form.setError("password", {
            type: "manual",
            message: "メールアドレスまたはパスワードが正しくありません。",
          })
        } else if (error.message.includes("auth/too-many-requests")) {
          form.setError("root", {
            type: "manual",
            message:
              "ログイン試行回数が多すぎます。しばらく時間をおいてから再度お試しください。",
          })
        } else {
          form.setError("root", {
            type: "manual",
            message:
              "サインイン中にエラーが発生しました。もう一度お試しください。",
          })
        }
      }
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>サインイン</CardTitle>
        <CardDescription>
          アカウントにサインインして続行してください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Googleでサインイン
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              または
            </span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {form.formState.errors.root && (
                <div className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="パスワード"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "サインイン中..." : "サインイン"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
