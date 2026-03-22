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
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getOutsouceBuses } from "@/api/outsourcing-driver";
import { Badge } from "../ui/badge";
import { VehicleDetailSheet } from "./rental-sheet";
import { Bus } from "@/types";
import { OutsourcingPayload, useBusOutsourcing } from "@/api/buses";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";

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

  // Vehicle Rentals State
  const [isEditRentalModalOpen, setIsEditRentalModalOpen] = useState(false);
  const [selectedRentalBus, setSelectedRentalBus] = useState<any>(null);
  const [editRentalAmount, setEditRentalAmount] = useState<string>("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const modifyBusRental = useBusOutsourcing();

  const handleOutsourcing = (data: OutsourcingPayload) => {
    setActiveActionId(data.bus_id); // Show spinner on the correct row
    modifyBusRental.mutate(data, {
      onSuccess: () => {
        refetch();
        setIsEditRentalModalOpen(false);
      },
      onSettled: () => {
        setActiveActionId(null);
      },
    });
  };

  const [isOpen, setIsOpen] = useState(false);

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

  // Table Loader
  const TableRowSkeleton = () => (
    <tr className="border-b border-border animate-pulse">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-8 rounded-md" />
      </td>
    </tr>
  );

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

            <Button
              disabled
              variant="outline"
              size="icon"
              className="bg-transparent"
            >
              <Filter className="h-4 w-4" />
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
                  Amount <small>(Per Day)</small>
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : (
                <>
                  {filteredData.length > 0 &&
                    filteredData.map((rental) => (
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
                        <td className="p-4 text-sm text-muted-foreground">
                          ₦{rental.outsourcing.amount_per_day.toLocaleString()}
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
                            {rental.status === "active"
                              ? "Active"
                              : "In Active"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedBus(rental)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedRentalBus(rental);
                                  setEditRentalAmount(
                                    rental.outsourcing.amount_per_day?.toString() ||
                                      "",
                                  );
                                  setIsEditRentalModalOpen(true);
                                }}
                              >
                                Edit Rental
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive cursor-pointer hover:bg-destructive/10"
                                disabled={
                                  modifyBusRental.isPending &&
                                  activeActionId === rental._id
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    window.confirm(
                                      "Are you sure you want to end this rental?",
                                    )
                                  ) {
                                    handleOutsourcing({
                                      outsourcing: false,
                                      amount_per_day: 0,
                                      bus_id: rental._id,
                                    });
                                  }
                                }}
                              >
                                End Rental
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </>
              )}

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

      {/* Edit Rental Amount Modal */}
      <Dialog
        open={isEditRentalModalOpen}
        onOpenChange={setIsEditRentalModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Rental Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_rental_amount">Amount Per Day</Label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                  ₦
                </span>
                <Input
                  id="edit_rental_amount"
                  type="number"
                  value={editRentalAmount}
                  onChange={(e) => setEditRentalAmount(e.target.value)}
                  className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Enter new daily rental amount"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsEditRentalModalOpen(false)}
              disabled={modifyBusRental.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editRentalAmount || Number(editRentalAmount) <= 0) {
                  // Ensure you have toast imported
                  toast.error("Please enter a valid amount per day.");
                  return;
                }

                if (selectedRentalBus) {
                  handleOutsourcing({
                    outsourcing: true, // Keep it outsourced, just update the amount
                    amount_per_day: Number(editRentalAmount),
                    bus_id: selectedRentalBus._id,
                  });
                }
              }}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={modifyBusRental.isPending}
            >
              {modifyBusRental.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vehicle Rental Sheet */}
      <VehicleDetailSheet
        bus={selectedBus}
        isOpen={!!selectedBus}
        onOpenChange={() => setSelectedBus(null)}
      />
    </Card>
  );
}
