"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Filter, Plus, MoreVertical, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

type RentalTab = "all" | "active" | "inactive"

const tabs: { id: RentalTab; label: string }[] = [
  { id: "all", label: "All Rentals" },
  { id: "active", label: "Active Contracts" },
  { id: "inactive", label: "In-Active Contracts" },
]

const rentals = [
  {
    id: 1,
    busId: "DEP-02-AJAH",
    vehicleType: "18-Seater Bus",
    client: "Apex Logistics Ltd.",
    rentalRate: "₦55,000",
    duration: "4 Weeks",
    paymentStatus: "paid" as const,
    status: "rented" as const,
    image: "/transport-bus-black.jpg",
  },
  {
    id: 2,
    busId: "DEP-04-OSHODI",
    vehicleType: "20-Seater Bus",
    client: "Lekki Tours",
    rentalRate: "₦70,000",
    duration: "3 weeks",
    paymentStatus: "pending" as const,
    status: "due" as const,
    image: "/passenger-bus.jpg",
  },
  {
    id: 3,
    busId: "DEPO-04-EFRD",
    vehicleType: "30-Seater Bus",
    client: "GIG Motors",
    rentalRate: "₦185,000",
    duration: "8 Weeks",
    paymentStatus: "overdue" as const,
    status: "rented" as const,
    image: "/shuttle-bus.png",
  },
  {
    id: 4,
    busId: "DEP-085-EFTS",
    vehicleType: "12-Seater Bus",
    client: "CAC Nigeria",
    rentalRate: "₦80,000",
    duration: "5 Weeks",
    paymentStatus: "paid" as const,
    status: "available" as const,
    image: "/transport-bus-black.jpg",
  },
  {
    id: 5,
    busId: "DEP-BUS-0958",
    vehicleType: "18-Seater Bus",
    client: "Local Church Group",
    rentalRate: "₦90,000",
    duration: "4 Days",
    paymentStatus: "na" as const,
    status: "available" as const,
    image: "/passenger-bus.jpg",
  },
  {
    id: 6,
    busId: "DEP-09-OBALENDE",
    vehicleType: "22-Seater Bus",
    client: "Zenith Corp.",
    rentalRate: "₦85,000",
    duration: "3 Days",
    paymentStatus: "deposit" as const,
    status: "rented" as const,
    image: "/shuttle-bus.png",
  },
]

export function VehicleRentalsTable() {
  const [activeTab, setActiveTab] = useState<RentalTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by bus ID / Code"
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

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create new booking</DialogTitle>
                  <p className="text-sm text-muted-foreground">Enter details for the new vehicle rental</p>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Bus Selection */}
                  <div className="space-y-2">
                    <Label>Select BUS To Rent</Label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select bus">
                          <div className="flex items-center gap-3">
                            <img src="/transport-bus-black.jpg" alt="Bus" className="w-10 h-6 rounded object-cover" />
                            <span>DEP-02-AJAH</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dep-02">DEP-02-AJAH</SelectItem>
                        <SelectItem value="dep-04">DEP-04-OSHODI</SelectItem>
                        <SelectItem value="dep-05">DEP-05-FESTAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Client and Contact Information*</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client /Company Name</Label>
                        <Input id="clientName" placeholder="Enter Client Name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person Name</Label>
                        <Input id="contactPerson" placeholder="Enter Contact Person" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone Number</Label>
                      <Input id="phone" placeholder="Enter Contact Phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter Contact Email" />
                    </div>
                  </div>

                  {/* Rental Charge */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chargeType">Rental Charge By (₦)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Daily" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chargeRate">Rental Charge Rate (₦)</Label>
                      <Input id="chargeRate" placeholder="E.g ₦50,000" />
                    </div>
                  </div>

                  {/* Contract Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Contract Start</Label>
                      <Input id="startDate" type="date" placeholder="DD/MM/YYY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Contract End</Label>
                      <Input id="endDate" type="date" placeholder="DD/MM/YYY" />
                    </div>
                  </div>

                  {/* Overdue Charges */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Label>Charges Applied on Overdue Rentals</Label>
                      <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="font-normal">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="font-normal">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chargeDuration">Charges Applied Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Daily" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chargeFee">Charges Applied Fee (₦)</Label>
                        <Input id="chargeFee" placeholder="E.g ₦50,000" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12">
                    Create Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vehicle Type / Model</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Client Company</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Rental Rate
                  <br />
                  <span className="text-xs font-normal">(Daily)*</span>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rent Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Payment Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <img
                      src={rental.image || "/placeholder.svg"}
                      alt={rental.vehicleType}
                      className="w-16 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-sm text-secondary">{rental.busId}</td>
                  <td className="p-4 text-sm">{rental.vehicleType}</td>
                  <td className="p-4 text-sm text-muted-foreground">{rental.client}</td>
                  <td className="p-4 text-sm text-muted-foreground">{rental.rentalRate}</td>
                  <td className="p-4 text-sm text-muted-foreground">{rental.duration}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        rental.paymentStatus === "paid" && "text-green-600",
                        rental.paymentStatus === "pending" && "text-orange-600",
                        rental.paymentStatus === "overdue" && "text-red-600",
                        rental.paymentStatus === "deposit" && "text-muted-foreground",
                        rental.paymentStatus === "na" && "text-muted-foreground",
                      )}
                    >
                      {rental.paymentStatus === "paid" && "Paid (Full)"}
                      {rental.paymentStatus === "pending" && "Pending"}
                      {rental.paymentStatus === "overdue" && "Overdue"}
                      {rental.paymentStatus === "deposit" && "Paid (Deposit)"}
                      {rental.paymentStatus === "na" && "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        rental.status === "rented" && "text-foreground",
                        rental.status === "due" && "text-red-600",
                        rental.status === "available" && "text-foreground",
                      )}
                    >
                      {rental.status === "rented" && "Rented Out"}
                      {rental.status === "due" && "Due Today"}
                      {rental.status === "available" && "Available"}
                    </span>
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Rental</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">End Rental</DropdownMenuItem>
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
