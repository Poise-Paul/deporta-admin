"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/lib/store/hooks"
import { login } from "@/lib/store/slices/auth-slice"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    // Simulate API call - replace with actual authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    dispatch(
      login({
        user: {
          id: "1",
          name: "Deporta Official",
          email: data.email,
          role: "super_admin",
          avatar: "/placeholder-user.jpg",
        },
        token: "mock-jwt-token",
      }),
    )

    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          className="h-12 border-0 border-b-2 border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="sr-only">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          className="h-12 border-0 border-b-2 border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  )
}
