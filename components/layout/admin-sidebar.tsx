"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DeportaLogo } from "@/components/deporta-logo"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/auth-slice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Menu,
  Truck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Headphones,
  Building2,
  FileText,
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
  },
  {
    title: "Staff Management",
    href: "/staff",
    icon: UserCog,
  },
  {
    title: "App Menu",
    icon: Menu,
    children: [
      { title: "Pick up stations", href: "/app-menu/pickup-stations" },
      { title: "Drop Off Locations", href: "/app-menu/dropoff-locations" },
      { title: "Routes", href: "/app-menu/routes" },
      { title: "Bus-Stops", href: "/app-menu/bus-stops" },
      { title: "Drivers", href: "/app-menu/drivers" },
      { title: "Bus Systems", href: "/app-menu/buses" },
    ],
  },
  {
    title: "Logistics",
    icon: Truck,
    children: [
      { title: "Driver Outsourcing", href: "/logistics/driver-outsourcing" },
      { title: "Vehicle Rentals", href: "/logistics/vehicle-rentals" },
      { title: "Bookings", href: "/logistics/bookings" },
    ],
  },
  {
    title: "Co-Operate Mngt.",
    icon: Building2,
    children: [
      { title: "Co-operate Accounts", href: "/co-operate/accounts" },
      { title: "Co-Operate Bookings", href: "/co-operate/bookings" },
    ],
  },
  {
    title: "CMS",
    href: "/cms",
    icon: FileText,
  },
  {
    title: "Support Tools",
    href: "/support",
    icon: Headphones,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [expandedItems, setExpandedItems] = useState<string[]>(["App Menu", "Logistics"])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isChildActive = (children?: { href: string }[]) => {
    if (!children) return false
    return children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <DeportaLogo />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isChildActive(item.children)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role === "super_admin" ? "Super Admin" : user?.role}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  )
}
