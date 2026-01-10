"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react"; // Install lucide-react if you haven't
import { Input } from "@/components/ui/input"; // Adjust path to your Input component
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)} // Add padding-right so text doesn't overlap icon
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1} // Prevents tabbing into the eye icon
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
