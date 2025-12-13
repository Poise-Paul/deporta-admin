"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type BusTab = "all" | "active" | "maintenance"

const tabs: { id: BusTab; label: string }[] = [
  { id: "all", label: "All Buses" },
  { id: "active", label: "Active" },
  { id: "maintenance", label: "In Maintenance" },
]

const buses = [
  {
    id: "DEP-02-AJAH",
    name: "Island Runner",
    route: "AJUB - OSBR",
    capacity: 20,
    driver: "Jejelola Rotimi",
    status: "active" as const,
    image: "/transport-bus-black.jpg",
  },
  {
    id: "DEP-04-OSHODI",
    name: "City Express",
    route: "OSH - LKI",
    capacity: 18,
    driver: "David Kolawole",
    status: "active" as const,
    image: "/passenger-bus.jpg",
  },
  {
    id: "DEP-05-FESTAC",
    name: "Festac Shuttle",
    route: "FST - CMS",
    capacity: 22,
    driver: "Adewale Qoyum",
    status: "maintenance" as const,
    image: "/shuttle-bus.png",
  },
  {
    id: "DEP-06-IKORODU",
    name: "Ikorodu Link",
    route: "IKD - OWO",
    capacity: 25,
    driver: "Fred Denis",
    status: "active" as const,
    image: "/transport-bus-black.jpg",
  },
]

export function BusSystemsTable() {
  const [activeTab, setActiveTab] = useState<BusTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBuses = buses.filter((bus) => {
    if (activeTab === "active") return bus.status === "active"
    if (activeTab === "maintenance") return bus.status === "maintenance"
    return true
  })

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Bus by ID or Name"
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
              Add Bus
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">All Buses</CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bus Image</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bus ID / Code</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bus Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Route</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Capacity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Driver</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <img
                      src={bus.image || "/placeholder.svg"}
                      alt={bus.name}
                      className="w-16 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-sm text-secondary">{bus.id}</td>
                  <td className="p-4 text-sm">{bus.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{bus.route}</td>
                  <td className="p-4 text-sm text-muted-foreground">{bus.capacity}</td>
                  <td className="p-4 text-sm text-muted-foreground">{bus.driver}</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        bus.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-yellow-500 text-yellow-600 bg-yellow-50",
                      )}
                    >
                      {bus.status === "active" ? "Active" : "In Maintenance"}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/app-menu/buses/${bus.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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
  )
}
