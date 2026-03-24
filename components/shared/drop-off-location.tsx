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
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { useForm } from "react-hook-form";
import {
  AddPickupStationPayload,
  DropOffStation as DropOffStationType,
} from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  DropOffPayload,
  getDropOffStations,
  useCreateDropOffStation,
  useDeleteDropOffStation,
  useDropOffStatus,
  useModifyDropOffStation,
} from "@/api/drop-off-locations";
import { updateSelDropOffStation } from "@/lib/store/slices/drop-off-station-slice";
import {
  AddDropOffStationDialog,
  EditDropOffStationDialog,
} from "./DropOffStationDialogue";

type LocationTab = "all" | "active" | "inactive";

interface Location {
  id: number;
  name: string;
  area: string;
  state: string;
  addedBy: string;
  dateAdded: string;
  status: "active" | "inactive";
}

interface LocationTableProps {
  title: string;
  addButtonText: string;
  searchPlaceholder: string;
  locations: Location[];
  tableTitle: string;
}

const tabs: { id: LocationTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
];

export function DropOffStation({
  title,
  addButtonText,
  locations,
  searchPlaceholder,
  tableTitle,
}: LocationTableProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [dropOffId, setDropOffId] = useState<DropOffStationType | null>();
  const [holdPickupBtn, setHoldPickupBtn] = useState(true);
  const [updateHoldDropOffBtn, setUpdateHoldDropOffBtn] = useState(true);
  const dropOffStationMutation = useCreateDropOffStation();

  const [area, setArea] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const deleteMutation = useDeleteDropOffStation();

  const {
    data: dropOffStations,
    refetch,
    isLoading: dropOffLoader,
  } = useQuery({
    queryKey: ["dropOffStations", currentPage, itemsPerPage],
    queryFn: () => getDropOffStations(currentPage, itemsPerPage),
  });

  const { register, setValue, watch, reset } = useForm<AddPickupStationPayload>(
    {
      values: {
        address: { value: "", coordinates: [0, 0] },
        area: "",
        country: "Nigeria",
        state: "lagos",
      },
    },
  );

  const {
    register: updateRegister,
    setValue: updateValue,
    watch: updateWatch,
  } = useForm<AddPickupStationPayload>({
    values: {
      address:
        typeof dropOffId?.address === "object"
          ? dropOffId.address
          : { value: dropOffId?.address || "", coordinates: [0, 0] },
      area: dropOffId?.area || "",
      country: dropOffId?.country || "Nigeria",
      state:
        dropOffId?.state === "Lagos State" ? "lagos" : dropOffId?.state || "",
    },
  });

  // const selectedState = watch("state");
  const selectedUpdateState = updateWatch("state");
  const handleWatch = watch();
  const handleUpdateWatch = updateWatch();

  const { address, country, state } = handleWatch;
  const {
    address: updateAddress,
    area: updateArea,
    state: updateState,
    country: updateCountry,
  } = handleUpdateWatch;

  const handleDeleteStation = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSuccess: () => refetch(),
    });
  };

  useEffect(() => {
    if (address && area && state && country) {
      setHoldPickupBtn(false);
    } else {
      setHoldPickupBtn(true);
    }
  }, [address, area, state, country]);

  // Update Address
  useEffect(() => {
    if (updateAddress && updateArea && updateState && updateCountry) {
      setUpdateHoldDropOffBtn(false);
    } else {
      setUpdateHoldDropOffBtn(true);
    }
  }, [updateAddress, updateArea, updateState, updateCountry]);

  useEffect(() => {
    refetch();
  }, [dropOffStations]);

  const modifyStationMutation = useModifyDropOffStation();

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allStations = dropOffStations?.drop_off_station?.data || [];

    const originalTotal =
      dropOffStations?.drop_off_station?.pagination?.totalPages || 1;

    // 1. Filter by Search Query first
    let filtered = allStations.filter((station) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        station.address?.value.toLowerCase().includes(searchStr) ||
        station.area?.toLowerCase().includes(searchStr) ||
        station.state?.toLowerCase().includes(searchStr) ||
        station.country?.toLowerCase().includes(searchStr)
      );
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
  }, [dropOffStations, activeTab, currentPage, itemsPerPage, searchQuery]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

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

  // Update Pickup State
  const updateMutation = useDropOffStatus();

  const handleDropOffStatus = (data: DropOffPayload) => {
    updateMutation.mutate(data, {
      onSuccess: () => refetch(),
    });
  };

  // Drop Off Map

  const [locationValue, setLocationValue] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const handlePlaceSelect = (place: {
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) => {
    setLocationValue(place.address);
    setCoordinates({
      latitude: place.latitude,
      longitude: place.longitude,
    });

    // Auto-populate area - priority: area > city > first part of address
    const extractedArea = place.area || place.city || "";
    setArea(extractedArea);

    // Auto-populate state
    if (place.state) {
      // Remove " State" suffix if present (e.g., "Lagos State" → "Lagos")
      const stateName = place.state.replace(/\s+State$/i, "").trim();

      // Find matching state in NIGERIA_STATES (case-insensitive)
      const matchedState = NIGERIA_STATES.find(
        (state) => state.toLowerCase() === stateName.toLowerCase(),
      );

      if (matchedState) {
        setSelectedState(matchedState.toLowerCase());
      } else {
        // If exact match not found, try partial match
        const partialMatch = NIGERIA_STATES.find(
          (state) =>
            stateName.toLowerCase().includes(state.toLowerCase()) ||
            state.toLowerCase().includes(stateName.toLowerCase()),
        );
        if (partialMatch) {
          setSelectedState(partialMatch.toLowerCase());
        }
      }
    }
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

            <AddDropOffStationDialog
              type="drop-off"
              onSubmit={(data) => {
                dropOffStationMutation.mutate(data, {
                  onSuccess: () => {
                    reset();
                    refetch();
                    setIsAddDialogOpen(false);
                  },
                });
              }}
              setIsAddDialogOpen={setIsAddDialogOpen}
              isAddDialogOpen={isAddDialogOpen}
              isLoading={dropOffStationMutation.isPending}
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
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Area
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
              {dropOffLoader ? (
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
                    <td className="p-4 capitalize text-sm text-muted-foreground">
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
                              dispatch(updateSelDropOffStation(station));
                              router.push(
                                `/app-menu/dropoff-locations/${station._id}`,
                              );
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleDropOffStatus({
                                drop_off_station_id: station._id,
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
                              // e.preventDefault();
                              setDropOffId({
                                drop_off_location_id: station._id,
                                address: {
                                  value: station.address.value,
                                  coordinates:
                                    station.address.location.coordinates,
                                },
                                area: station.area,
                                state: station.state,
                                country: station.country,
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
                              handleDeleteStation(station._id);
                            }}
                            className="text-destructive"
                            disabled={deleteMutation.isPending}
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

              {!dropOffLoader && paginatedData.length === 0 && (
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

      {/* Edit Drop Off Modals */}
      {dropOffId && (
        <EditDropOffStationDialog
          data={dropOffId}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={(data) => {
            modifyStationMutation.mutate(data, {
              onSuccess: () => {
                refetch();
                setIsEditDialogOpen(false);
              },
            });
          }}
          isLoading={modifyStationMutation.isPending}
        />
      )}
    </Card>
  );
}
