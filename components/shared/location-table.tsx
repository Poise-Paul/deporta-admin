"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type LocationTab = "all" | "active" | "inactive"

interface Location {
  id: number
  name: string
  area: string
  state: string
  addedBy: string
  dateAdded: string
  status: "active" | "inactive"
}

interface LocationTableProps {
  title: string
  addButtonText: string
  searchPlaceholder: string
  locations: Location[]
  tableTitle: string
}

const tabs: { id: LocationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
]

export function LocationTable({ title, addButtonText, searchPlaceholder, locations, tableTitle }: LocationTableProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredLocations = locations.filter((location) => {
    if (activeTab === "active") return location.status === "active"
    if (activeTab === "inactive") return location.status === "inactive"
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
              placeholder={searchPlaceholder}
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
                  {tab.id === "all" ? `All ${title}` : tab.label}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  {addButtonText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name</Label>
                    <Input id="name" placeholder="Enter location name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input id="area" placeholder="Enter area" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Country</Label>
                    <Input id="state" placeholder="Enter state/country" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add {title.slice(0, -1)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">{tableTitle}</CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Area</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">State / Country</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Added By</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Added</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr key={location.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium text-sm">{location.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{location.area}</td>
                  <td className="p-4 text-sm text-muted-foreground">{location.state}</td>
                  <td className="p-4 text-sm text-muted-foreground">{location.addedBy}</td>
                  <td className="p-4 text-sm text-muted-foreground">{location.dateAdded}</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        location.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-orange-500 text-orange-600 bg-orange-50",
                      )}
                    >
                      {location.status === "active" ? "Active" : "In-active"}
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
                          {location.status === "active" ? "De-activate" : "Activate"}
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
  )
}
