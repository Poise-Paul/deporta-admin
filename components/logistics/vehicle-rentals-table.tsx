"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Filter, Plus, MoreVertical, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getOutsouceBuses } from "@/api/outsourcing-driver";
import { Badge } from "../ui/badge";

type RentalTab = "all" | "active" | "inactive";

const tabs: { id: RentalTab; label: string }[] = [
  { id: "all", label: "All Rentals" },
  { id: "active", label: "Active Rentals" },
  { id: "inactive", label: "In-Active Rentals" },
];

export function VehicleRentalsTable() {
  const [activeTab, setActiveTab] = useState<RentalTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["outsourceBuses", currentPage],
    retry: false,
    queryFn: () => getOutsouceBuses(currentPage, itemsPerPage),
  });

  // Assuming your API returns a structure like the Maintenance one:
  const pagination = data?.buses.pagination;
  const totalPages = pagination?.totalPages || 1;

  const filteredData = useMemo(() => {
    if (!data?.buses?.data) return [];

    return data.buses.data.filter((item) => {
      // 1. Filter by Status Tab
      const matchesStatus =
        activeTab === "all" ||
        (activeTab === "active" && item.status === "active") ||
        (activeTab === "inactive" &&
          (item.status === "in-active" || !item.status));

      // 2. Filter by Search Query
      // We check name, email, or any other relevant field
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.id_code?.toLowerCase().includes(searchLower) ||
        item.name_label?.toLowerCase().includes(searchLower) ||
        item.added_by.first_name?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [data, activeTab, searchQuery]);

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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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

            <Button disabled variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button disabled className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Create new booking
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter details for the new vehicle rental
                  </p>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Bus Selection */}
                  <div className="space-y-2">
                    <Label>Select BUS To Rent</Label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select bus">
                          <div className="flex items-center gap-3">
                            <img
                              src="/transport-bus-black.jpg"
                              alt="Bus"
                              className="w-10 h-6 rounded object-cover"
                            />
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
                    <Label className="text-xs text-muted-foreground">
                      Client and Contact Information*
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client /Company Name</Label>
                        <Input
                          id="clientName"
                          placeholder="Enter Client Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">
                          Contact Person Name
                        </Label>
                        <Input
                          id="contactPerson"
                          placeholder="Enter Contact Person"
                        />
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
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter Contact Email"
                      />
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
                      <Input
                        id="startDate"
                        type="date"
                        placeholder="DD/MM/YYY"
                      />
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
                        <Label htmlFor="chargeDuration">
                          Charges Applied Duration
                        </Label>
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
                        <Label htmlFor="chargeFee">
                          Charges Applied Fee (₦)
                        </Label>
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus Image
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus ID / Code
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Vehicle Type / Model
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Mileage
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Tracker Id
                  <br />
                  <span className="text-xs font-normal">(Bus)*</span>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Last Updated
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Driver(s) assigned
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((rental) => (
                <tr
                  key={rental._id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <img
                      src={rental.bus_photos[0] || "/placeholder.svg"}
                      alt={rental.id_code}
                      className="w-16 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-sm text-secondary">
                    {rental.id_code}
                  </td>
                  <td className="p-4 text-sm">{rental.name_label}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {rental.mileage}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {rental.tracker_id}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(rental.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {/* <span
                      className={cn(
                        "text-sm font-medium",
                        rental.status === "paid" && "text-green-600",
                        rental.status === "pending" && "text-orange-600",
                      )}
                    ></span> */}
                    <span className="flex flex-wrap gap-1">
                      {rental.drivers_assigned.map((driver) => {
                        return (
                          <Badge
                            key={driver._id}
                            variant="outline"
                            className="text-[10px] px-1"
                          >
                            {driver.first_name} {driver.last_name}
                          </Badge>
                        );
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        rental.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-yellow-500 text-yellow-600 bg-yellow-50",
                      )}
                    >
                      {rental.status === "active" ? "Active" : "In Active"}
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Rental</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          End Rental
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    {`No results found ${
                      searchQuery && `for "${searchQuery}"`
                    }`}
                  </td>
                </tr>
              )}
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
  );
}
