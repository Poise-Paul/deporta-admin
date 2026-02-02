import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, Users } from "lucide-react";

interface OnSiteFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function OnSiteFilter({ value, onValueChange }: OnSiteFilterProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">On-Site</h2>
        <p className="text-xs text-muted-foreground">
          Currently available at the terminal
        </p>
      </div>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buses">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Buses On Site</span>
            </div>
          </SelectItem>
          <SelectItem value="drivers">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Drivers On Site</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
