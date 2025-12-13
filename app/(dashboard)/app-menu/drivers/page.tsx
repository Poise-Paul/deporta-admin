"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type DriverTab = "all" | "active" | "inactive"

const tabs: { id: DriverTab; label: string }[] = [
  { id: "all", label: "All Drivers" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
]

const drivers = [
  {
    id: 1,
    name: "Jejelola Rotimi",
    phone: "+234 8132 4958 67",
    bus: "DEP-02-AJAH",
    route: "AJUB - OSBR",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/african-driver-man.jpg",
  },
  {
    id: 2,
    name: "David Kolawole",
    phone: "+234 8132 4958 67",
    bus: "DEP-04-OSHODI",
    route: "OSH - LKI",
    dateJoined: "12/05/2025",
    status: "active" as const,
    avatar: "/man-driver-professional.jpg",
  },
  {
    id: 3,
    name: "Adewale Qoyum",
    phone: "+234 8132 4958 67",
    bus: "DEP-05-FESTAC",
    route: "FST - CMS",
    dateJoined: "16/06/2025",
    status: "inactive" as const,
    avatar: "/young-man-casual-portrait.png",
  },
]

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<DriverTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDrivers = drivers.filter((driver) => {
    if (activeTab === "active") return driver.status === "active"
    if (activeTab === "inactive") return driver.status === "inactive"
    return true
  })

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Driver By Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-72 bg-transparent"
              />
            </div>

            {/* Tabs and Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      activeTab === tab.id
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : "bg-transparent border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="icon" className="bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>

              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-6 py-3 border-b border-border">
            <CardTitle className="text-base font-semibold">All Drivers</CardTitle>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Assigned Bus</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Route</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={driver.avatar || "/placeholder.svg"} alt={driver.name} />
                          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{driver.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{driver.phone}</td>
                    <td className="p-4 text-sm font-medium text-secondary">{driver.bus}</td>
                    <td className="p-4 text-sm text-muted-foreground">{driver.route}</td>
                    <td className="p-4 text-sm text-muted-foreground">{driver.dateJoined}</td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          driver.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {driver.status === "active" ? "Active" : "In-active"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {driver.status === "active" ? "De-activate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Show
              <select className="border border-border rounded px-2 py-1 text-sm bg-background">
                <option>of 8</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">1 - Page</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                  {"<"}
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  1
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  2
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {">"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
