"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  Eye,
  Loader2,
  Edit,
  Trash2,
  X,
  UserX,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NewBusStopPayload } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  BusStopPayload,
  getAllBusStops,
  useBusStopStatus,
  useCreateBusStop,
  useDeleteBusStop,
  useModifyBusStop,
} from "@/api/bus-stops";
import { updateSelBusStop } from "@/lib/store/slices/bus-stop-slice";
import { AddBusStopDialog, EditBusStopDialog } from "./BusStopDialogue";

type LocationTab = "all" | "active" | "in-active";

interface LocationTableProps {
  title: string;
  addButtonText: string;
  searchPlaceholder: string;
  tableTitle: string;
}

const tabs: { id: LocationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "in-active", label: "In-Active" },
];

export function BusStopTable({
  title,
  addButtonText,
  searchPlaceholder,
  tableTitle,
}: LocationTableProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [bustopId, setBusStopId] = useState<NewBusStopPayload>();

  const [holdBustopBtn, setHoldBustopBtn] = useState(true);
  const [holdEditBustopBtn, setHoldEditBustopBtn] = useState(true);

  const busStopMutation = useCreateBusStop();
  const modifyBusStop = useModifyBusStop();

  const deleteMutation = useDeleteBusStop();

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const {
    data: busStops,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["busStops", currentPage, itemsPerPage, searchQuery, activeTab],
    queryFn: () =>
      getAllBusStops(currentPage, itemsPerPage, searchQuery, activeTab),
  });

  const handleDeleteBustop = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSuccess: () => refetch(),
    });
  };

  useEffect(() => {
    refetch();
  }, [busStops]);

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allStations = busStops?.bus_stop?.data || [];
    const originalTotal = busStops?.bus_stop?.pagination?.totalPages || 1;

    return {
      paginatedData: allStations,
      totalPages: originalTotal,
    };
  }, [busStops]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

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

  const updateMutation = useBusStopStatus();

  const handleBustopStatus = (data: BusStopPayload) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-2 w-72 bg-transparent"
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
                  {tab.id === "all" ? `All ${title}` : tab.label}
                </Button>
              ))}
            </div>

            <AddBusStopDialog
              onSubmit={(data) => {
                busStopMutation.mutate(data, {
                  onSuccess: () => {
                    refetch();
                    setIsAddDialogOpen(false);
                  },
                });
              }}
              setIsAddDialogOpen={setIsAddDialogOpen}
              isAddDialogOpen={isAddDialogOpen}
              isLoading={busStopMutation.isPending}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">
            {tableTitle}
          </CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Location
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Area
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Routes
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  State / Country
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Added By
                </th>

                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date Added
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
                paginatedData &&
                paginatedData.map((station) => (
                  <tr
                    key={station._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4 font-medium text-sm">
                      {station.address.value}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {station.area}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {station.routes}
                    </td>
                    <td className="p-4 text-sm capitalize text-muted-foreground">
                      {station.state} / {station.country}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {station.added_by.first_name} {station.added_by.last_name}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(station.createdAt).toDateString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          station.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {station.status === "active" ? "Active" : "In-active"}
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
                              dispatch(updateSelBusStop(station));
                              router.push(`/app-menu/bus-stops/${station._id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setBusStopId({
                                bus_stop_id: station._id,
                                routes: station.routes,
                                area: station.area,
                                state: station.state,
                                country: station.country,
                                address: {
                                  value: station.address.value,
                                  coordinates:
                                    station.address.location.coordinates,
                                },
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleBustopStatus({
                                bus_stop_id: station._id,
                                status:
                                  station.status === "active"
                                    ? "in-active"
                                    : "active",
                              });
                            }}
                            className={
                              station.status === "active"
                                ? "text-destructive"
                                : "text-success"
                            }
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                {station.status === "active" ? (
                                  <UserX className="mr-2 text-destructive h-4 w-4" />
                                ) : (
                                  <UserCheck className="mr-2 text-success h-4 w-4" />
                                )}
                              </>
                            )}

                            {station.status === "active"
                              ? "De-activate"
                              : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // 1. Prevent the dropdown from closing
                              e.preventDefault();

                              // 2. Trigger your delete logic
                              handleDeleteBustop(station._id);
                            }}
                            className="text-destructive"
                            disabled={deleteMutation.isPending} // Disable to prevent double-clicks
                          >
                            {deleteMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                Delete
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
              {/* No data! */}
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

      {/* Edit Bus Stop */}
      {bustopId && (
        <EditBusStopDialog
          data={bustopId}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={(data) => {
            modifyBusStop.mutate(data, {
              onSuccess: () => {
                refetch();
                setIsEditDialogOpen(false);
              },
            });
          }}
          isLoading={modifyBusStop.isPending}
        />
      )}
    </Card>
  );
}
