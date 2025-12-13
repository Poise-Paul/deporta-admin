"use client"

import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/staff": "Staff Management",
  "/app-menu/pickup-stations": "Pick up station",
  "/app-menu/dropoff-locations": "Drop Off Locations",
  "/app-menu/routes": "Routes",
  "/app-menu/bus-stops": "Bus-Stops",
  "/app-menu/drivers": "Drivers",
  "/app-menu/buses": "Buses",
  "/logistics/driver-outsourcing": "Driver Outsourcing",
  "/logistics/vehicle-rentals": "Vehicle Rentals",
  "/cms": "CMS",
  "/support": "Support Tools",
  "/settings": "Settings",
}

export function AdminHeader() {
  const pathname = usePathname()
  const { user } = useAppSelector((state) => state.auth)

  // Find the matching title, handling nested routes
  const title =
    Object.entries(pageTitles).find(([path]) => pathname === path || pathname.startsWith(path + "/"))?.[1] ||
    "Dashboard"

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Replace the Add Quick Staff Button */}
        {/* {pathname === "/dashboard" && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        )} */}

        <div className="flex -space-x-2">
          <Avatar className="h-8 w-8 border-2 border-card">
            <AvatarImage src="/woman-brown-hair.png" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-card">
            <AvatarImage src="/thoughtful-man-glasses.png" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-card">
            <AvatarImage src="/professional-woman.png" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
