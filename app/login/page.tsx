import { LoginForm } from "@/components/auth/login-form";
import { DeportaLogo } from "@/components/deporta-logo";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #EA6A12 0%, #C2410C 25%, #1E3A5F 75%, #0F172A 100%)",
          }}
        />

        {/* Decorative Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full border border-white/10" />
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white/10" />
          <div className="absolute top-32 right-32 w-48 h-48 rounded-full border border-white/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* Admin Icon */}
            <Image
              alt="star-image"
              height={100}
              width={100}
              src="People-Star.png"
            />

            {/* Welcome Text */}
            <h1 className="text-5xl font-bold mb-2">Hello</h1>
            <h2 className="text-5xl font-bold mb-6">
              Deporta Transport Admin! <span className="text-5xl">👋</span>
            </h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Welcome to the Deporta admin control panel monitor everything on
              the Deporta Transport App from here and carry out other duties
            </p>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-center">
            © 2025 Deporta Transport Unit. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            {/* <DeportaLogo className="mb-8" /> */}
            <Image
              src="Deporta-Logo.svg"
              height={200}
              width={200}
              alt="deporta-log"
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Login
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome Back!
            </h2>
            <p className="text-muted-foreground">
              Welcome back, view the customers, drivers, locations, manage
              routes and more
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
