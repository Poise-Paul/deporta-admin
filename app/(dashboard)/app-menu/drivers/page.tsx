"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MapPinOff,
  MapPin,
  UserX,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getDriversList } from "@/api/staffs";
import { useStaffStatus } from "@/api/dashboard";
import { UpdateStaff } from "@/types";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/api/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelDriver } from "@/lib/store/slices/driver-slice";
import {
  DriverOnSiteType,
  DriverOutsourceType,
  useOutsourceStatus,
  useSiteStatus,
} from "@/api/driver";

type DriverTab = "all" | "active" | "inactive";

const tabs: { id: DriverTab; label: string }[] = [
  { id: "all", label: "All Drivers" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
];

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<DriverTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Role Integration
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // get the current user
  const { data, error, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ["drivers"],
    retry: false,
    queryFn: () => getDriversList(),
  });

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allStaffs = data?.staffs?.data || [];

    // 1. Filter by Search Query (Checking multiple fields)
    let filtered = allStaffs.filter((driver) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        driver.first_name?.toLowerCase().includes(searchStr) ||
        driver.last_name?.toLowerCase().includes(searchStr)
      );
    });

    // 2. Filter by Tab Status
    if (activeTab === "active") {
      filtered = filtered.filter((s) => s.status === "active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((s) => s.status === "in-active");
    }

    // Role Logic
    if (roleFilter !== "all") {
      filtered = filtered.filter((s) => {
        // 1. Handle Verification Filters
        if (roleFilter === "outsourcing")
          return s.user_type.type_id.outsourcing;
        if (roleFilter === "on-site") return s.user_type.type_id.is_on_site;
        if (roleFilter === "off-site") return !s.user_type.type_id.is_on_site;
      });
    }

    // 3. Calculate Total Pages based on the filtered/searched list
    const total = Math.ceil(filtered.length / itemsPerPage) || 1;

    // 4. Slice the data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedData: slicedData, totalPages: total };
  }, [data, activeTab, currentPage, itemsPerPage, searchQuery, roleFilter]);

  const updateMutation = useStaffStatus();
  const updateOnsiteMutation = useSiteStatus();
  const updateOutsourceMutation = useOutsourceStatus();

  const handleUpdateCustomer = (data: UpdateStaff) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle Site Status
  const handleSiteStatus = (data: DriverOnSiteType) => {
    updateOnsiteMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle Outsource status
  const handleOutsourceStatus = (data: DriverOutsourceType) => {
    updateOutsourceMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
        refetch();
      },
    });
  };

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

  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Driver By Name"
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "bg-transparent",
                      roleFilter !== "all" && "border-primary text-primary",
                    )}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                    All Drivers
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setRoleFilter("outsourcing")}
                  >
                    Outsourcing Drivers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("on-site")}>
                    On-Site Drivers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("off-site")}>
                    Off-Site Drivers
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-6 py-3 border-b border-border">
            <CardTitle className="text-base font-semibold">
              All Drivers
            </CardTitle>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Outsource
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    On-Site
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Date Joined
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
                  paginatedData.map((driver) => (
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
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal",
                            driver.user_type.type_id.outsourcing
                              ? "border-green-500 text-green-600 bg-green-50"
                              : "border-blue-500 text-blue-600 bg-blue-50",
                          )}
                        >
                          {driver.user_type.type_id.outsourcing
                            ? "Outsource"
                            : "In House"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal",
                            driver.user_type.type_id.is_on_site
                              ? "border-green-500 text-green-600 bg-green-50"
                              : "border-orange-500 text-orange-600 bg-orange-50",
                          )}
                        >
                          {driver.user_type.type_id.is_on_site
                            ? "On-Site"
                            : "Off-Site"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(driver.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
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
                              onClick={() => {
                                dispatch(updateSelDriver(driver));
                                router.push(`/app-menu/drivers/${driver._id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                handleUpdateCustomer({
                                  status:
                                    (driver.status ?? "in-active") === "active"
                                      ? "in-active"
                                      : "active",
                                  user_id: driver._id,
                                });
                              }}
                              className={
                                driver.status === "active"
                                  ? "text-destructive"
                                  : "text-success"
                              }
                            >
                              {updateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  {driver.status === "active" ? (
                                    <UserX className="mr-2 text-destructive h-4 w-4" />
                                  ) : (
                                    <UserCheck className="mr-2 text-success h-4 w-4" />
                                  )}
                                </>
                              )}

                              {driver.status === "active"
                                ? "De-activate"
                                : "Activate"}
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
                              className="cursor-pointer"
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                handleSiteStatus({
                                  is_on_site: driver.user_type.type_id
                                    .is_on_site
                                    ? false
                                    : true,
                                  driver_id: driver.user_type.type_id._id,
                                });
                              }}
                              className="cursor-pointer"
                            >
                              {updateOnsiteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {driver.user_type.type_id.is_on_site ? (
                                <span className="flex items-center text-orange-600">
                                  <MapPinOff className="mr-2 text-orange-600 h-4 w-4" />{" "}
                                  Set as Off-Site
                                </span>
                              ) : (
                                <span className="flex items-center text-green-600">
                                  <MapPin className="mr-2 h-4 w-4" /> Mark as
                                  On-Site
                                </span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
                {!isLoading && paginatedData.length === 0 && (
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
            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Show
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-border rounded px-2 py-1 text-sm bg-background"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              per page
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"}
              </Button>

              {/* Dynamic Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      currentPage === pageNumber
                        ? "bg-[#0A1942] text-white hover:bg-[#0A1942]/90" // Matches your dark blue style
                        : "text-muted-foreground",
                    )}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              {/* Next Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
