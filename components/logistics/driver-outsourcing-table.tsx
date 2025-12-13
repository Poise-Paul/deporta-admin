"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type OutsourcingTab = "all" | "active" | "inactive"

const tabs: { id: OutsourcingTab; label: string }[] = [
  { id: "all", label: "All Drivers" },
  { id: "active", label: "Active Contracts" },
  { id: "inactive", label: "In-Active Contracts" },
]

const outsourcedDrivers = [
  {
    id: 1,
    name: "David Kolawole",
    phone: "+234 8132 4958 67",
    agency: "Fidelity Bank",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "05/05/2025",
    avatar: "/african-man-professional.png",
  },
  {
    id: 2,
    name: "Agbaje Franklin",
    phone: "+234 8132 4958 67",
    agency: "Automata Limited",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "12/05/2025",
    avatar: "/young-man-casual.jpg",
  },
  {
    id: 3,
    name: "Konibaje Kolawole",
    phone: "+234 8132 4958 67",
    agency: "GIG Logistics",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "16/06/2025",
    avatar: "/man-driver-professional.jpg",
  },
  {
    id: 4,
    name: "Demiris Samson",
    phone: "+234 8132 4958 67",
    agency: "Uber X Digitals",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "18/05/2025",
    avatar: "/african-driver-man.jpg",
  },
  {
    id: 5,
    name: "Kole Agbaje",
    phone: "+234 8132 4958 67",
    agency: "Marina",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "18/05/2025",
    avatar: "/young-man-casual-portrait.png",
  },
  {
    id: 6,
    name: "Destiny Favour",
    phone: "+234 8132 4958 67",
    agency: "Costain",
    contractStart: "14/08/2025",
    contractEnd: "14/10/2025",
    state: "Lagos, Nigeria",
    dateAdded: "20/07/2025",
    avatar: "/diverse-woman-smiling.png",
  },
]

export function DriverOutsourcingTable() {
  const [activeTab, setActiveTab] = useState<OutsourcingTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search driver name or client"
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

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Outsourced Driver</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver">Select Driver</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="david">David Kolawole</SelectItem>
                        <SelectItem value="agbaje">Agbaje Franklin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency / Client Name</Label>
                    <Input id="agency" placeholder="Enter agency name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Contract Start</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Contract End</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Country</Label>
                    <Input id="state" placeholder="Enter state/country" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add Outsourced Driver
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">All Drivers Outsource list</CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Drivers Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Drivers Tel</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Agency /Client Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contract Start</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contract End</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">State / Country</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Added</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {outsourcedDrivers.map((driver) => (
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
                  <td className="p-4 text-sm font-medium">{driver.agency}</td>
                  <td className="p-4 text-sm text-muted-foreground">{driver.contractStart}</td>
                  <td className="p-4 text-sm text-muted-foreground">{driver.contractEnd}</td>
                  <td className="p-4 text-sm text-muted-foreground">{driver.state}</td>
                  <td className="p-4 text-sm text-muted-foreground">{driver.dateAdded}</td>
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
                        <DropdownMenuItem>Edit Contract</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">End Contract</DropdownMenuItem>
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
