"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type StaffTab = "all" | "active" | "inactive"

const tabs: { id: StaffTab; label: string }[] = [
  { id: "all", label: "All Staffs" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
]

const staffMembers = [
  {
    id: 1,
    name: "Mr Elips",
    role: "Super Admin",
    email: "admin@deportalogistics.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/african-man-professional.png",
  },
  {
    id: 2,
    name: "Fashina Simisola",
    role: "Customer Rep Staff",
    email: "davidkolawole@gmail.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "inactive" as const,
    avatar: "/diverse-woman-smiling.png",
  },
  {
    id: 3,
    name: "Tobiloba Dev",
    role: "Developer",
    email: "davidkolawole@gmail.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/young-man-casual.jpg",
  },
  {
    id: 4,
    name: "Abass Koyang",
    role: "Admin Staff",
    email: "davidkolawole@gmail.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/african-driver-man.jpg",
  },
  {
    id: 5,
    name: "Nse-Obong Paul",
    role: "Developer",
    email: "davidkolawole@gmail.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "inactive" as const,
    avatar: "/man-driver-professional.jpg",
  },
  {
    id: 6,
    name: "David Kolawole",
    role: "Support Staff",
    email: "davidkolawole@gmail.com",
    phone: "+44 20 7946 0123",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/young-man-casual-portrait.png",
  },
]

export function StaffManagementTable() {
  const [activeTab, setActiveTab] = useState<StaffTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredStaff = staffMembers.filter((staff) => {
    if (activeTab === "active") return staff.status === "active"
    if (activeTab === "inactive") return staff.status === "inactive"
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
              placeholder="Search Staff By Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-transparent"
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
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Staff</SelectItem>
                        <SelectItem value="support">Support Staff</SelectItem>
                        <SelectItem value="customer-rep">Customer Rep Staff</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="maintenance">Maintenance Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add Staff</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">All Staffs</CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email Address</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Joined</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{staff.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{staff.role}</td>
                  <td className="p-4 text-sm text-muted-foreground">{staff.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{staff.phone}</td>
                  <td className="p-4 text-sm text-muted-foreground">{staff.dateJoined}</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        staff.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-orange-500 text-orange-600 bg-orange-50",
                      )}
                    >
                      {staff.status === "active" ? "Active" : "In-active"}
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
                          {staff.status === "active" ? "De-activate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Info */}
        <div className="px-6 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">Maintenance Staff</p>
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
