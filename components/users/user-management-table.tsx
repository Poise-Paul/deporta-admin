"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Download, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type UserTab = "all" | "drivers" | "customers" | "onsite"

const tabs: { id: UserTab; label: string }[] = [
  { id: "all", label: "All Users" },
  { id: "drivers", label: "Drivers" },
  { id: "customers", label: "Customers" },
  { id: "onsite", label: "Onsite Drivers" },
]

const users = [
  {
    id: 1,
    name: "David Kolawole",
    role: "Driver",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "05/05/2025",
    status: "active" as const,
    avatar: "/african-man-professional.png",
  },
  {
    id: 2,
    name: "James David",
    role: "Customer",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "05/05/2025",
    status: "inactive" as const,
    avatar: "/young-man-casual.jpg",
  },
  {
    id: 3,
    name: "Jessica Franklin",
    role: "Customer",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "10/05/2025",
    status: "active" as const,
    avatar: "/diverse-woman-smiling.png",
  },
  {
    id: 4,
    name: "Miracle Jerly",
    role: "Customer",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "12/06/2025",
    status: "inactive" as const,
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 5,
    name: "Adewale Qoyum",
    role: "Driver",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "18/06/2025",
    status: "inactive" as const,
    avatar: "/african-driver-man.jpg",
  },
  {
    id: 6,
    name: "Fred Denis",
    role: "Driver",
    email: "davidkolawole@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "22/06/2025",
    status: "active" as const,
    avatar: "/man-driver-professional.jpg",
  },
]

export function UserManagementTable() {
  const [activeTab, setActiveTab] = useState<UserTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => {
    if (activeTab === "drivers") return user.role === "Driver"
    if (activeTab === "customers") return user.role === "Customer"
    if (activeTab === "onsite") return user.role === "Driver" && user.status === "active"
    return true
  })

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
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

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 bg-transparent"
              />
            </div>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">All Users</CardTitle>
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Change Field</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.role}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.phone}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.dateJoined}</td>
                  <td className="p-4 text-sm text-muted-foreground">—</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        user.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-orange-500 text-orange-600 bg-orange-50",
                      )}
                    >
                      {user.status === "active" ? "Active" : "In-active"}
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
                          {user.status === "active" ? "De-activate" : "Activate"}
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
