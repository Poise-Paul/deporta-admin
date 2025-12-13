import { cn } from "@/lib/utils";
import Image from "next/image";

interface DeportaLogoProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "light";
}

export function DeportaLogo({
  className,
  showText = true,
  variant = "default",
}: DeportaLogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-secondary";
  const accentColor = variant === "light" ? "text-white" : "text-primary";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Image src="/Deporta-Logo.svg" height={70} width={70} alt="deporta-logo" />
      {showText && (
        <span className={cn("text-xl font-bold", textColor)}>Admin</span>
      )}
    </div>
  );
}
