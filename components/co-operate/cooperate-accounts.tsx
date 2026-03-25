"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
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
import { Search, Filter, Plus, MoreVertical, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCooperateAccounts, getTotalBooking } from "@/api/bookings";
import { useDispatch } from "react-redux";
import { updateSelCorporate } from "@/lib/store/slices/co-operate-slice";
import { useRouter } from "next/navigation";

type OutsourcingTab = "all" | "active" | "inactive";

const tabs: { id: OutsourcingTab; label: string }[] = [
  { id: "all", label: "All Accounts" },
  { id: "active", label: "Active Co-operates" },
  { id: "inactive", label: "In-Active Co-operates" },
];

export function CooperateTable() {
  const [activeTab, setActiveTab] = useState<OutsourcingTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["co-operate", currentPage, itemsPerPage],
    queryFn: () => getCooperateAccounts(currentPage, itemsPerPage),
  });

  // Pagination
  const { paginatedData, totalPages } = React.useMemo(() => {
    const allAccounts = data?.corporate.data || [];

    const originalTotal = data?.corporate?.pagination?.totalPages || 1;

    // 1. Filter by Search Query first
    let filtered = allAccounts.filter((account) => {
      const searchStr = searchQuery.toLowerCase();
      return account.user_type.type_id.company_name
        ?.toLowerCase()
        .includes(searchStr);
    });

    // 2. Then filter by Active/Inactive Tab
    if (activeTab === "active") {
      filtered = filtered.filter((s) => s.status === "active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((s) => s.status === "in-active");
    }

    return {
      paginatedData: filtered,
      totalPages: originalTotal,
    };
  }, [data, activeTab, currentPage, itemsPerPage, searchQuery]);

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

  const dispatch = useDispatch();
  const router = useRouter();

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

            {/* No Use of Filter Icon */}
            {/* <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button> */}

            {/* Hide Create New Button */}
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">
            All Co-Operate Accounts
          </CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Co-Operate User
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Registration Number
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Official Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Business Address
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
                paginatedData?.map((account) => (
                  <tr
                    key={account._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={account.profile_image || "/placeholder.svg"}
                            alt={account.user_type.type_id.company_name}
                          />
                          <AvatarFallback>
                            {account.user_type.type_id.company_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {account.user_type.type_id.company_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {account.user_type.type_id.official_phone_number}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {account.user_type.type_id.registration_number}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {account.user_type.type_id.business_email}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {account.user_type.type_id.residential_address}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          account.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-yellow-500 text-yellow-600 bg-yellow-50",
                        )}
                      >
                        {account.status === "active" ? "Active" : "In Active"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(account.createdAt).toDateString()}
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
                              dispatch(updateSelCorporate(account));
                              router.push(`/co-operate/accounts/${account._id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit Contract</DropdownMenuItem> */}
                          {/* <DropdownMenuItem className="text-destructive">
                            End Contract
                          </DropdownMenuItem> */}
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
                    {`No results found ${searchQuery && `for "${searchQuery}"`}`}
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
  );
}
