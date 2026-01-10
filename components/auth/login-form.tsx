"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/store/hooks";
import { login } from "@/lib/store/slices/auth-slice";
import { Loader2 } from "lucide-react";
import { useLoginUser } from "@/api/onboarding";
import { PasswordInput } from "../ui/password-input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleWatch = watch();

  const { email, password } = handleWatch;

  const loginUser = useLoginUser();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // Login Implementation
    loginUser.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (res) => {
          dispatch(
            login({
              user: {
                id: "1",
                name: "Deporta Official",
                email: data.email,
                role: "super_admin",
                avatar: "/placeholder-user.jpg",
                refresh_token: res.refresh_token,
              },
              token: res.token,
            })
          );

          router.push("/dashboard");
        },
        onSettled(data, error, variables, onMutateResult, context) {
          setIsLoading(false);
        },
      }
    );
    // Mock successful login
  };

  const [holdBtn, setHoldBtn] = useState(true);

  useEffect(() => {
    if (email && password) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [email, password]);

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
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="sr-only">
          Password
        </Label>
        <PasswordInput
          id="password"
          placeholder="Password"
          className="h-12 border-0 border-b-2 border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className={`w-full h-12 bg-primary ${
          isLoading || holdBtn ? "opacity-30" : ""
        } hover:bg-primary/90 text-primary-foreground font-semibold`}
        disabled={isLoading || holdBtn}
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
  );
}
