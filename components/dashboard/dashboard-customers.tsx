"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const customers = [
  {
    id: 1,
    name: "David Kolawole",
    email: "davidkolawole@gmail.com",
    phone: "+234 7040 4958 67",
    dateJoined: "05/05/2025",
    avatar: "/african-man-professional.png",
  },
  {
    id: 2,
    name: "Jeremy Frank",
    email: "jeremyfrank@gmail.com",
    phone: "+234 8132 4958 67",
    dateJoined: "05/05/2025",
    avatar: "/young-man-casual.jpg",
  },
  {
    id: 3,
    name: "Daisy Tiago",
    email: "daisytiago@gmail.com",
    phone: "+234 7040 4958 67",
    dateJoined: "08/05/2025",
    avatar: "/diverse-woman-smiling.png",
  },
  {
    id: 4,
    name: "Franka Beverly",
    email: "frankabeverly@gmail.com",
    phone: "+234 7040 4958 67",
    dateJoined: "—",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 5,
    name: "Franka Beverly",
    email: "frankabeverly@gmail.com",
    phone: "+234 9139 4958 67",
    dateJoined: "25/04/2025",
    avatar: "/confident-businesswoman.png",
  },
]

export function DashboardCustomers() {
  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email Address</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date Joined</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.phone}</td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.dateJoined}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive">De-activate</DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
