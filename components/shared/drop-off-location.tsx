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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Loader2,
  DeleteIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { useForm } from "react-hook-form";
import { AddPickupStationPayload, EditDropOffStationPayload } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelPickupStation } from "@/lib/store/slices/pickup-station-slice";
import {
  getDropOffStations,
  useCreateDropOffStation,
  useDeleteDropOffStation,
  useModifyDropOffStation,
} from "@/api/drop-off-locations";
import { updateSelDropOffStation } from "@/lib/store/slices/drop-off-station-slice";

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

export function LocationTable({
  title,
  addButtonText,
  searchPlaceholder,
  tableTitle,
}: LocationTableProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [dropOffId, setDropOffId] = useState<EditDropOffStationPayload>();
  const [holdPickupBtn, setHoldPickupBtn] = useState(true);
  const [updateHoldDropOffBtn, setUpdateHoldDropOffBtn] = useState(true);
  const dropOffStationMutation = useCreateDropOffStation();
  const deleteMutation = useDeleteDropOffStation();

  const {
    data: dropOffStations,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["dropOffStations"],
    queryFn: () => getDropOffStations(),
  });

  const { register, setValue, watch } = useForm<AddPickupStationPayload>({
    values: {
      address: "",
      area: "",
      country: "Nigeria",
      state: "lagos",
    },
  });

  const {
    register: updateRegister,
    setValue: updateValue,
    watch: updateWatch,
  } = useForm<AddPickupStationPayload>({
    values: {
      address: dropOffId?.address || "",
      area: dropOffId?.area || "",
      country: dropOffId?.country || "Nigeria",
      state:
        dropOffId?.state === "Lagos State" ? "lagos" : dropOffId?.state || "",
    },
  });

  const selectedState = watch("state");
  const selectedUpdateState = updateWatch("state");
  const handleWatch = watch();
  const handleUpdateWatch = updateWatch();

  const { address, area, country, state } = handleWatch;
  const {
    address: updateAddress,
    area: updateArea,
    state: updateState,
    country: updateCountry,
  } = handleUpdateWatch;

  const handleAddDropOffStation = () => {
    dropOffStationMutation.mutate(
      {
        address,
        area,
        country,
        state,
      },
      { onSuccess: () => refetch(), onSettled: () => setIsAddDialogOpen(false) }
    );
  };

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

  const handleModifyDropOffStation = (stationId: string) => {
    modifyStationMutation.mutate(
      {
        drop_off_location_id: stationId,
        address: updateAddress,
        area: updateArea,
        state: updateState,
        country: updateCountry,
      },
      {
        onSuccess: () => refetch(),
        onSettled: () => setIsEditDialogOpen(false),
      }
    );
  };

  const filteredStations = React.useMemo(() => {
    const allStations = dropOffStations?.drop_off_station?.data || [];

    if (activeTab === "active") {
      return allStations.filter((station) => station.status === "active");
    }
    if (activeTab === "inactive") {
      return allStations.filter((station) => station.status === "in-active");
    }
    return allStations;
  }, [dropOffStations, activeTab]);

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
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab.id === "all" ? `All ${title}` : tab.label}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4" />
                  {addButtonText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pickup Address</Label>
                    <Input
                      id="name"
                      {...register("address")}
                      placeholder="Enter pickup station address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      {...register("area")}
                      placeholder="Enter area"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Select
                      value={selectedState}
                      onValueChange={(value) => setValue("state", value)}
                    >
                      <SelectTrigger className="w-full bg-transparent border-border">
                        <SelectValue placeholder="Select a State" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIA_STATES.map((state) => (
                          <SelectItem key={state} value={state.toLowerCase()}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Country</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      defaultValue={"Nigeria"}
                      placeholder="Enter country"
                    />
                  </div>
                  <Button
                    disabled={dropOffStationMutation.isPending || holdPickupBtn}
                    onClick={handleAddDropOffStation}
                    className={`w-full bg-primary ${
                      dropOffStationMutation.isPending || holdPickupBtn
                        ? "opacity-30"
                        : ""
                    } hover:bg-primary/90 text-primary-foreground`}
                  >
                    {dropOffStationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Add {title.slice(0, -1)}</>
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
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : (
                filteredStations &&
                filteredStations.map((station) => (
                  <tr
                    key={station._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4 font-medium text-sm">
                      {station.address}
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
                            : "border-orange-500 text-orange-600 bg-orange-50"
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
                                `/app-menu/dropoff-locations/${station._id}`
                              );
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // e.preventDefault();
                              setDropOffId({
                                drop_off_location_id: station._id,
                                area: station.area,
                                state: station.state,
                                country: station.country,
                                address: station.address,
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
            </tbody>
          </table>
        </div>

        {/* Edit Modals */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Drop-Off Location Address</Label>
                <Input
                  id="name"
                  {...updateRegister("address")}
                  placeholder="Enter drop-off location address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  {...updateRegister("area")}
                  placeholder="Enter area"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Select
                  value={selectedUpdateState}
                  onValueChange={(value) => updateValue("state", value)}
                >
                  <SelectTrigger className="w-full bg-transparent border-border">
                    <SelectValue placeholder="Select a State" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIA_STATES.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase()}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Country</Label>
                <Input
                  id="country"
                  {...updateRegister("country")}
                  defaultValue={"Nigeria"}
                  placeholder="Enter country"
                />
              </div>
              <Button
                disabled={
                  modifyStationMutation.isPending || updateHoldDropOffBtn
                }
                onClick={() =>
                  handleModifyDropOffStation(
                    dropOffId?.drop_off_location_id || ""
                  )
                }
                className={`w-full bg-primary ${
                  modifyStationMutation.isPending || updateHoldDropOffBtn
                    ? "opacity-30"
                    : ""
                } hover:bg-primary/90 text-primary-foreground`}
              >
                {modifyStationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Edit {title.slice(0, -1)}</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* End Modals */}

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
      <Toaster />
    </Card>
  );
}
