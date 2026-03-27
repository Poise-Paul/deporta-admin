"use client";

import React, { useEffect, useState } from "react";
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
  Download,
  MoreVertical,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { getUsersList } from "@/api/user";
import { useStaffStatus } from "@/api/dashboard";
import { UpdateStaff } from "@/types";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateSelCustomer } from "@/lib/store/slices/customer-slice";
import { useRouter } from "next/navigation";

type UserTab = "all" | "active" | "in-active";

const tabs: { id: UserTab; label: string }[] = [
  { id: "all", label: "All Users" },
  { id: "active", label: "Active" },
  { id: "in-active", label: "In-Active" },
];
export function UserManagementTable() {
  const [activeTab, setActiveTab] = useState<UserTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // Get All Users
  const {
    data,
    error,
    refetch: refetchUsers,
    isLoading,
  } = useQuery({
    queryKey: ["users", currentPage, itemsPerPage, searchQuery, activeTab],
    retry: false,
    queryFn: () =>
      getUsersList(currentPage, itemsPerPage, searchQuery, activeTab),
  });

  const handleDownload = () => {
    const dataToExport = data?.users.data || [];

    // 2. Define Headers
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Date Joined",
    ];

    // 3. Map data to rows
    const csvRows = dataToExport.map((staff) => [
      staff.first_name,
      staff.last_name,
      staff.email,
      staff.phone_number,
      staff.user_type.value,
      staff.status,
      new Date(staff.createdAt).toLocaleDateString(),
    ]);

    // 4. Create CSV Content
    const csvContent = [headers, ...csvRows].map((e) => e.join(",")).join("\n");

    // 5. Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Deporta_Staff_List_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  };

  // Role Integration
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allUsers = data?.users.data || [];
    const originalTotal = data?.users?.pagination?.totalPages || 1;

    return {
      paginatedData: allUsers,
      totalPages: originalTotal,
    };
  }, [data]);

  // Clamps the current page if it exceeds the new total pages
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Loader
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

  const updateMutation = useStaffStatus();

  const handleUpdateCustomer = (data: UpdateStaff) => {
    updateMutation.mutate(data, {
      onSuccess: () => refetchUsers(),
    });
  };

  const dispatch = useDispatch();
  const router = useRouter();
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
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("corporate")}>
                  Corporate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("driver")}>
                  Driver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("customer")}>
                  Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("verified")}>
                  Verified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("non-verified")}>
                  Non Verified
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleDownload}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Email Address
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date Joined
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Verified
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
                paginatedData.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.profile_image || "/placeholder.svg"}
                            alt={user.first_name[0]}
                          />
                          <AvatarFallback>
                            {user.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.user_type.value}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.phone_number}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {" "}
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          user.verify_email
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {user.verify_email ? "Verified" : "Not Verified"}
                      </Badge>
                    </td>
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
                              dispatch(updateSelCustomer(user));
                              router.push(`/users/${user._id}`);
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
                                  user.status === "active"
                                    ? "in-active"
                                    : "active",
                                user_id: user._id,
                              });
                            }}
                            className={
                              user.status === "active"
                                ? "text-destructive"
                                : "text-success"
                            }
                          >
                            {updateMutation.isPending && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            {user.status === "active"
                              ? "De-activate"
                              : "Activate"}
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
      <Toaster />
    </Card>
  );
}
