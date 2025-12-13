import { cn } from "@/lib/utils"

interface DeportaLogoProps {
  className?: string
  showText?: boolean
  variant?: "default" | "light"
}

export function DeportaLogo({ className, showText = true, variant = "default" }: DeportaLogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-secondary"
  const accentColor = variant === "light" ? "text-white" : "text-primary"

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-12">
        {/* Stylized "BL" Logo */}
        <path
          d="M8 6C8 6 12 4 18 6C24 8 28 6 32 4C36 2 40 4 40 8C40 12 36 16 30 18C24 20 18 18 14 16C10 14 8 10 8 6Z"
          className={cn(variant === "light" ? "fill-white" : "fill-secondary")}
        />
        <path
          d="M12 14C12 14 16 12 22 14C28 16 32 14 36 12C40 10 44 12 44 16C44 20 40 24 34 26C28 28 22 26 18 24C14 22 12 18 12 14Z"
          className="fill-primary"
        />
        <path
          d="M4 22C4 22 8 20 14 22C20 24 24 22 28 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn(variant === "light" ? "stroke-white/60" : "stroke-secondary/60")}
        />
      </svg>
      {showText && <span className={cn("text-xl font-bold", textColor)}>Admin</span>}
    </div>
  )
}
