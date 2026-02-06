"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getOutsouceDrivers } from "@/api/outsourcing-driver";
import { Badge } from "../ui/badge";
import { DriverOutsourceType, useOutsourceStatus } from "@/api/driver";
import { queryClient } from "@/api/queryClient";
import { Toaster } from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import { getDriversList } from "@/api/staffs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Driver, DriverData } from "@/types";

type OutsourcingTab = "all" | "active" | "inactive";

const tabs: { id: OutsourcingTab; label: string }[] = [
  { id: "all", label: "All Drivers" },
  { id: "active", label: "Active Drivers" },
  { id: "inactive", label: "In-Active Drivers" },
];

export function DriverOutsourcingTable() {
  const [activeTab, setActiveTab] = useState<OutsourcingTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get All Users

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["outsourceDrivers", currentPage],
    retry: false,
    queryFn: () => getOutsouceDrivers(currentPage, itemsPerPage),
  });

  // Assuming your API returns a structure like the Maintenance one:
  const pagination = data?.staffs.pagination;
  const totalPages = pagination?.totalPages || 1;

  const filteredData = useMemo(() => {
    if (!data?.staffs?.data) return [];

    return data.staffs.data.filter((item) => {
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
        item.first_name?.toLowerCase().includes(searchLower) ||
        item.last_name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [data, activeTab, searchQuery]);

  const updateOutsourceMutation = useOutsourceStatus();

  const [driverSearch, setDriverSearch] = useState("");
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setLimit(10);
  }, [driverSearch]);

  // get Drivers List
  const {
    data: driversData,
    isFetching,
    isLoading: driverLoader,
    refetch: refetchOutsource,
  } = useQuery({
    queryKey: ["driversSearch", driverSearch, limit],
    queryFn: () => getDriversList(currentPage, limit, driverSearch),
    placeholderData: (previousData) => previousData,
  });

  const handleOutsourceStatus = (data: DriverOutsourceType) => {
    updateOutsourceMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["outsourceDrivers"] });
        refetch();
        setIsAddDialogOpen(false)
      },
    });
  };

  const [selectedDriverId, setSelectedDriverId] = useState<DriverData | null>(
    null,
  );
  const drivers =
    driversData?.staffs.data.filter(
      (driver) => !driver.user_type.type_id.outsourcing,
    ) || [];

  const hasMore = driversData?.staffs.pagination.count || 0 > drivers.length;

  const [open, setOpen] = useState(false);

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
              placeholder="Search driver name"
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

            {/* <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button> */}

            {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            </Dialog> */}

            {/* Second Add Table */}
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className="w-full" asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedDriverId
                          ? `${selectedDriverId.first_name} ${selectedDriverId.last_name}`
                          : "Outsource new driver..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command shouldFilter={false}>
                        {" "}
                        {/* shouldFilter={false} because we filter on server */}
                        <CommandInput
                          placeholder="Type name or ID code..."
                          onValueChange={(val) => setDriverSearch(val)}
                        />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          {isLoading && (
                            <div className="p-4 text-xs text-center">
                              Searching fleet...
                            </div>
                          )}
                          <CommandEmpty>
                            No driver found in the system.
                          </CommandEmpty>
                          <CommandGroup>
                            {drivers.map((driver) => (
                              <CommandItem
                                key={driver._id}
                                value={driver._id}
                                onSelect={(currentValue) => {
                                  setSelectedDriverId(driver);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDriverId?._id === driver._id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {driver.first_name} {driver.last_name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {driver.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>

                          {/* Load More */}
                          {hasMore && (
                            <div className="p-2 border-t border-border">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-primary font-bold hover:bg-primary/5"
                                disabled={isFetching}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLimit((prev) => prev + 10);
                                }}
                              >
                                {isFetching
                                  ? "Loading more..."
                                  : "Load More Drivers"}
                              </Button>
                            </div>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    disabled={
                      !selectedDriverId || updateOutsourceMutation.isPending
                    }
                    onClick={() => {
                      handleOutsourceStatus({
                        outsourcing: selectedDriverId?.user_type.type_id
                          .outsourcing
                          ? false
                          : true,
                        driver_id:
                          selectedDriverId?.user_type.type_id._id || "",
                      });
                    }}
                    className={`w-full bg-primary ${updateOutsourceMutation.isPending && "opacity-30"} hover:bg-primary/90 text-primary-foreground`}
                  >
                    {updateOutsourceMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      "Add Outsourced Driver"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">
            All Drivers Outsource list
          </CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Drivers Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Drivers Tel
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Driver Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Verification Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Last Updated
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date Added
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
                filteredData.length > 0 &&
                filteredData.map((driver) => (
                  <tr
                    key={driver._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={driver.profile_image || "/placeholder.svg"}
                            alt={driver.first_name}
                          />
                          <AvatarFallback>
                            {driver.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {driver.first_name} {driver.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {driver.phone_number}
                    </td>
                    <td className="p-4 text-sm font-medium">{driver.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          driver.verify_email
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {driver.verify_email ? "Verified" : "Not Verified"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(driver.updatedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
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
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(driver.createdAt).toLocaleString()}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleOutsourceStatus({
                                outsourcing: driver.user_type.type_id
                                  .outsourcing
                                  ? false
                                  : true,
                                driver_id: driver.user_type.type_id._id,
                              });
                            }}
                            className="text-destructive"
                          >
                            {updateOutsourceMutation.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {driver.user_type.type_id.outsourcing ? (
                              <span className="flex items-center text-blue-600">
                                <RefreshCw className="mr-2 h-4 w-4" /> Move
                                In-House
                              </span>
                            ) : (
                              <span className="flex items-center text-muted-foreground">
                                <ExternalLink className="mr-2 h-4 w-4" />{" "}
                                Outsource Driver
                              </span>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
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
          {/* Items Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {currentPage} of {totalPages} Pages
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {"<"}
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      currentPage === page
                        ? "bg-[#0A1942] text-white hover:bg-[#0A1942]/90"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}

              {/* Next Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages || isLoading}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <Toaster />
    </Card>
  );
}
