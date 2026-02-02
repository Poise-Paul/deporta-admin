import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
  onClick?: () => void; // For state-based navigation
}

export function BackButton({ label = "Back", onClick }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1 -ml-2 text-muted-foreground hover:text-primary transition-colors"
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
