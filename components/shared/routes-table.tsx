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
  DropdownMenuSeparator,
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
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPickupStations,
  useDeletePickupStation,
} from "@/api/pick-up-stations";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { useForm } from "react-hook-form";
import {
  AddPickupStationPayload,
  AddTripRoute,
  EditPickupStationPayload,
  EditTripRoute,
  EntryPoint,
  WeekdayType,
} from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelPickupStation } from "@/lib/store/slices/pickup-station-slice";
import {
  getRoutes,
  useCreateTripRoute,
  useDeleteRoute,
  useModifyRoutes,
} from "@/api/routes";
import { getAllBusStops, useDeleteBusStop } from "@/api/bus-stops";
import { updateSelRoute } from "@/lib/store/slices/route-slice";
import { getDropOffStations } from "@/api/drop-off-locations";
import { Switch } from "../ui/switch";

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

export function RoutesTable({
  title,
  addButtonText,
  searchPlaceholder,
  tableTitle,
}: LocationTableProps) {
  const [activeTab, setActiveTab] = useState<LocationTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [routeId, setRouteId] = useState<EditTripRoute>();

  const [holdBtn, setHoldBtn] = useState(true);
  const [holdEditPickupBtn, setHoldEditPickupBtn] = useState(true);

  const addTripRoute = useCreateTripRoute();
  const modifyTripRoute = useModifyRoutes();

  const deleteMutation = useDeleteRoute();

  const {
    data: tripRoutes,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });

  const { data: busStops } = useQuery({
    queryKey: ["busStops"],
    queryFn: () => getAllBusStops(),
  });

  const initialDay: WeekdayType = {
    active: false,
    value: [],
  };

  const defaultRoutine = {
    monday: initialDay,
    tuesday: initialDay,
    wednesday: initialDay,
    thursday: initialDay,
    friday: initialDay,
    saturday: initialDay,
    sunday: initialDay,
  };

  const { register, reset, setValue, watch } = useForm<AddTripRoute>({
    values: {
      rate: 0,
      flat_rate: 0,
      rate_per_km: 0,
      code: "",
      destination: { value: "", longitude: 0, latitude: 0 },
      starting_point: { value: "", longitude: 0, latitude: 0 },
      route_distance: "",
      number_of_stops: [],
      country: "Nigeria",
      state: "lagos",
      routine: {
        monday: { ...initialDay },
        tuesday: { ...initialDay },
        wednesday: { ...initialDay },
        thursday: { ...initialDay },
        friday: { ...initialDay },
        saturday: { ...initialDay },
        sunday: { ...initialDay },
      },
    },
  });

  const {
    register: updateRegister,
    setValue: updateValue,
    watch: updateWatch,
  } = useForm<AddTripRoute>({
    values: {
      rate: Number(routeId?.rate),
      flat_rate: Number(routeId?.flat_rate),
      rate_per_km: Number(routeId?.rate_per_km),
      code: `${routeId?.code}`,
      routine: routeId?.routine ?? defaultRoutine,

      destination:
        typeof routeId?.destination === "object"
          ? routeId.destination
          : { value: routeId?.destination || "", longitude: 0, latitude: 0 },
      starting_point:
        typeof routeId?.starting_point === "object"
          ? routeId.starting_point
          : { value: routeId?.starting_point || "", longitude: 0, latitude: 0 },
      route_distance: `${routeId?.route_distance}`,
      number_of_stops: Array.isArray(routeId?.number_of_stops)
        ? routeId.number_of_stops.flat()
        : [],
      country: routeId?.country || "Nigeria",
      state:
        routeId?.state === "Lagos State" || routeId?.state === "Lagos"
          ? "lagos"
          : routeId?.state || "",
    },
  });

  const selectedState = watch("state");
  const selectedUpdateState = updateWatch("state");
  const handleWatch = watch();
  const handleUpdateWatch = updateWatch();

  const {
    rate,
    rate_per_km,
    code,
    flat_rate,
    destination,
    starting_point,
    route_distance,
    number_of_stops,
    country,
    state,
  } = handleWatch;

  const {
    rate: updateRate,
    flat_rate: updateFlatRate,
    rate_per_km: updateRatePerKm,
    code: updateCode,
    starting_point: updateStartingPoint,
    route_distance: updateRouteDistance,
    number_of_stops: updateNumberOfStops,
    destination: updateDestination,
    country: updateCountry,
    state: updateState,
    routine,
  } = handleUpdateWatch;

  const handleAddTripRoute = () => {
    addTripRoute.mutate(
      {
        rate,
        rate_per_km,
        code,
        flat_rate,
        destination,
        starting_point,
        route_distance,
        number_of_stops,
        country,
        state,
        routine,
      },
      {
        onSuccess: () => {
          reset();
          refetch();
        },
        onSettled: () => setIsAddDialogOpen(false),
      },
    );
  };

  const handleModifyPickupStation = () => {
    modifyTripRoute.mutate(
      {
        trip_route_id: routeId?.trip_route_id || "",
        rate: updateRate,
        rate_per_km: updateRatePerKm,
        code: updateCode,
        flat_rate: updateFlatRate,
        destination: updateDestination,
        starting_point: updateStartingPoint,
        route_distance: updateRouteDistance,
        number_of_stops: updateNumberOfStops,
        country: updateCountry,
        state: updateState,
        routine,
      },
      {
        onSuccess: () => refetch(),
        onSettled: () => setIsEditDialogOpen(false),
      },
    );
  };

  const handleDeleteRoute = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSuccess: () => refetch(),
    });
  };

  useEffect(() => {
    if (
      rate &&
      rate_per_km &&
      code &&
      flat_rate &&
      destination &&
      starting_point &&
      route_distance &&
      number_of_stops &&
      country &&
      state
    ) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [
    rate,
    rate_per_km,
    code,
    flat_rate,
    destination,
    starting_point,
    route_distance,
    number_of_stops,
    country,
    state,
  ]);

  useEffect(() => {
    if (
      updateRate &&
      updateFlatRate &&
      updateRatePerKm &&
      updateCode &&
      updateStartingPoint &&
      updateRouteDistance &&
      updateNumberOfStops &&
      updateDestination &&
      updateCountry &&
      updateState
    ) {
      setHoldEditPickupBtn(false);
    } else {
      setHoldEditPickupBtn(true);
    }
  }, [
    updateRate,
    updateFlatRate,
    updateRatePerKm,
    updateCode,
    updateStartingPoint,
    updateRouteDistance,
    updateNumberOfStops,
    updateDestination,
    updateCountry,
    updateState,
  ]);

  useEffect(() => {
    refetch();
  }, [tripRoutes]);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allRoutes = tripRoutes?.trip_route.data || [];

    // 1. Filter by Search Query (Checking multiple fields)
    let filtered = allRoutes.filter((station) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        station.starting_point?.value.toLowerCase().includes(searchStr) ||
        station.destination?.value.toLowerCase().includes(searchStr) ||
        station.code?.toLowerCase().includes(searchStr)
      );
    });

    // 2. Filter by Tab Status
    if (activeTab === "active") {
      filtered = filtered.filter((s) => s.status === "active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((s) => s.status === "in-active");
    }

    // 3. Calculate Total Pages based on the filtered/searched list
    const total = Math.ceil(filtered.length / itemsPerPage) || 1;

    // 4. Slice the data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedData: slicedData, totalPages: total };
  }, [tripRoutes, activeTab, currentPage, itemsPerPage, searchQuery]);

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

  const { data: pickupStations } = useQuery({
    queryKey: ["pickupStations"],
    queryFn: () => getPickupStations(),
  });

  const { data: dropOffStations } = useQuery({
    queryKey: ["dropOffStations"],
    queryFn: () => getDropOffStations(),
  });

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

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4" />
                  {addButtonText}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate</Label>
                      <div className="flex rounded-md shadow-sm">
                        {/* Naira Symbol Add-on */}
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                          ₦
                        </span>

                        <Input
                          id="rate"
                          type="number"
                          {...register("rate")}
                          placeholder="Enter rate amount"
                          className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flat_rate">Flat Rate</Label>
                      <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                          ₦
                        </span>
                        <Input
                          id="flat_rate"
                          type="number"
                          {...register("flat_rate")}
                          placeholder="0.00"
                          className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate_per_km">Rate Per KM</Label>
                      <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                          ₦
                        </span>
                        <Input
                          id="rate_per_km"
                          type="number"
                          {...register("rate_per_km")}
                          placeholder="0.00"
                          className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        {...register("code")}
                        placeholder="Enter Code"
                      />
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="starting_point">Staring Point</Label>
                    <Input
                      id="starting_point"
                      {...register("starting_point")}
                      placeholder="Enter Starting Point"
                    />
                  </div> */}
                  <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                    <Label className="text-primary font-bold">
                      Starting Point
                    </Label>

                    <Select
                      onValueChange={(id) => {
                        const stop = busStops?.bus_stop.data.find(
                          (s) => s._id === id,
                        );
                        if (stop) {
                          setValue("starting_point", {
                            value: stop.location.value.toLowerCase(),
                            latitude: stop.location.latitude,
                            longitude: stop.location.longitude,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder={
                            watch("starting_point.value") ||
                            "Select Starting Point"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupStations?.pickup_station.data.map((stop) => (
                          <SelectItem key={stop._id} value={stop._id}>
                            {stop.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                    <Label className="text-primary font-bold">
                      Destination
                    </Label>

                    <Select
                      onValueChange={(id) => {
                        const stop = busStops?.bus_stop.data.find(
                          (s) => s._id === id,
                        );
                        if (stop) {
                          setValue("destination", {
                            value: stop.location.value.toLowerCase(),
                            latitude: stop.location.latitude,
                            longitude: stop.location.longitude,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder={
                            watch("destination.value") || "Select Destination"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {dropOffStations?.drop_off_station.data.map((stop) => (
                          <SelectItem key={stop._id} value={stop._id}>
                            {stop.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weekly SAcheduler */}
                  <div className="space-y-4 border-t pt-4">
                    <Label className="text-lg font-bold">
                      Weekly Operating Schedule
                    </Label>

                    {(
                      [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ] as const
                    ).map((day) => (
                      <div
                        key={day}
                        className="p-3 border rounded-md bg-muted/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="capitalize font-semibold">
                            {day}
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Active
                            </span>
                            <Switch
                              checked={watch(`routine.${day}.active`)}
                              onCheckedChange={(val) =>
                                setValue(`routine.${day}.active`, val)
                              }
                            />
                          </div>
                        </div>

                        {watch(`routine.${day}.active`) && (
                          <div className="space-y-2">
                            {watch(`routine.${day}.value`)?.map(
                              (slot, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-3 gap-2 items-end bg-background p-2 rounded border"
                                >
                                  <div>
                                    <Label className="text-[10px]">
                                      Departure (From)
                                    </Label>
                                    <Input
                                      type="time"
                                      value={slot.from}
                                      onChange={(e) => {
                                        const current = [
                                          ...watch(`routine.${day}.value`),
                                        ];
                                        current[index].from = e.target.value;
                                        setValue(
                                          `routine.${day}.value`,
                                          current,
                                        );
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-[10px]">
                                      Arrival (To)
                                    </Label>
                                    <Input
                                      type="time"
                                      value={slot.too}
                                      onChange={(e) => {
                                        const current = [
                                          ...watch(`routine.${day}.value`),
                                        ];
                                        current[index].too = e.target.value;
                                        setValue(
                                          `routine.${day}.value`,
                                          current,
                                        );
                                      }}
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => {
                                      const current = watch(
                                        `routine.${day}.value`,
                                      ).filter((_, i) => i !== index);
                                      setValue(`routine.${day}.value`, current);
                                    }}
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              ),
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                const current =
                                  watch(`routine.${day}.value`) || [];
                                setValue(`routine.${day}.value`, [
                                  ...current,
                                  {
                                    from: "08:00",
                                    too: "10:00",
                                    status: "scheduled",
                                  },
                                ]);
                              }}
                            >
                              <Plus size={12} className="mr-1" /> Add Time Slot
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* End Weekly Schedule */}

                  <div className="space-y-2">
                    <Label htmlFor="route_distance">Route Distance</Label>
                    <div className="flex rounded-md shadow-sm">
                      <Input
                        id="route_distance"
                        type="number"
                        {...register("route_distance")}
                        placeholder="0"
                        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {/* KM Unit Suffix */}
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                        KM
                      </span>
                    </div>
                  </div>
                  {busStops && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Select Bus-Stops Along this Route
                      </label>
                      <Select
                        value="" // Keep placeholder visible
                        onValueChange={(id) => {
                          // 1. Find the full stop object from your data source
                          const selectedStop = busStops?.bus_stop.data.find(
                            (s) => s._id === id,
                          );

                          if (selectedStop) {
                            const currentStops = watch("number_of_stops") || [];

                            // 2. Create the EntryPoint object
                            const newEntry: EntryPoint = {
                              value: selectedStop.location.value.toLowerCase(),
                              longitude: selectedStop.location.longitude,
                              latitude: selectedStop.location.latitude,
                            };

                            // 3. Check for duplicates based on coordinates or value
                            const isDuplicate = currentStops.some(
                              (s) => s.value === newEntry.value,
                            );

                            if (!isDuplicate) {
                              setValue("number_of_stops", [
                                ...currentStops,
                                newEntry,
                              ]);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-transparent border-border">
                          <SelectValue placeholder="Add bus-stops..." />
                        </SelectTrigger>
                        <SelectContent>
                          {busStops?.bus_stop.data
                            .filter(
                              (stop) =>
                                // Filter out if the location value already exists in the number_of_stops array
                                !watch("number_of_stops")?.some(
                                  (s) =>
                                    s.value === stop.location.value.toLowerCase(),
                                ),
                            )
                            .map((stop) => (
                              <SelectItem key={stop._id} value={stop._id}>
                                {stop.location.value}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* 2. Display Selected Bus-Stops as Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {watch("number_of_stops").map((stopValue, key) => (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 pr-1 py-1"
                          >
                            <span className="capitalize">
                              {stopValue.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = watch("number_of_stops");
                                setValue(
                                  "number_of_stops",
                                  current.filter((s) => s !== stopValue),
                                );
                              }}
                              className="hover:bg-destructive hover:text-white rounded-full p-0.5 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                      disabled
                      defaultValue={"Nigeria"}
                      placeholder="Enter country"
                    />
                  </div>
                  <Button
                    disabled={addTripRoute.isPending || holdBtn}
                    onClick={handleAddTripRoute}
                    className={`w-full bg-primary ${
                      addTripRoute.isPending || holdBtn ? "opacity-30" : ""
                    } hover:bg-primary/90 text-primary-foreground`}
                  >
                    {addTripRoute.isPending ? (
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
                  Starting Point
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Destination
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Code
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
                      {station.starting_point.value}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {station.destination.value}
                    </td>
                    <td className="p-4 text-sm capitalize text-muted-foreground">
                      {station.code}
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
                              dispatch(updateSelRoute(station));
                              router.push(`/app-menu/routes/${station._id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setRouteId({
                                trip_route_id: station._id,
                                rate: station.rate,
                                flat_rate: station.flat_rate,
                                rate_per_km: station.rate_per_km,
                                code: station.code,
                                destination: station.destination,
                                starting_point: station.starting_point,
                                state: station.state,
                                country: station.country,
                                route_distance: station.route_distance,
                                number_of_stops: station.number_of_stops,
                                routine: station.routine,
                              });

                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // 1. Prevent the dropdown from closing
                              e.preventDefault();

                              handleDeleteRoute(station._id);
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

        {/* Edit Trip Route Modal */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rate</Label>
                  <Input
                    id="name"
                    {...updateRegister("rate")}
                    placeholder="Enter rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flat_rate">Flat Rate</Label>
                  <Input
                    id="flat_rate"
                    {...updateRegister("flat_rate")}
                    placeholder="Enter Flat Rate"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate_per_km">Rate Per KM</Label>
                  <Input
                    id="rate_per_km"
                    {...updateRegister("rate_per_km")}
                    placeholder="Enter Rate Per Km"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    {...updateRegister("code")}
                    placeholder="Enter code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="starting_point">Starting Point</Label>
                <Input
                  id="starting_point"
                  {...updateRegister("starting_point")}
                  placeholder="Enter Starting Point"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  {...updateRegister("destination")}
                  placeholder="Enter Destination"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="route_distance">Route Distance</Label>
                <Input
                  id="route_distance"
                  {...updateRegister("route_distance")}
                  placeholder="Enter Route Distance"
                />
              </div>
              {busStops && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select Bus-Stops Along this Route
                  </label>
                  <Select
                    value="" // Keep placeholder visible
                    onValueChange={(id) => {
                      // 1. Find the full stop object from the data list using the ID
                      const selectedStop = busStops?.bus_stop.data.find(
                        (s) => s._id === id,
                      );

                      if (selectedStop) {
                        const currentStops =
                          updateWatch("number_of_stops") || [];

                        // 2. Create the EntryPoint object with mock coordinates
                        const newEntry: EntryPoint = {
                          value: selectedStop.location.value.toLowerCase(),
                          longitude: selectedStop.location.longitude,
                          latitude: selectedStop.location.latitude,
                        };

                        // 3. Check if this value already exists in our array of objects
                        const isDuplicate = currentStops.some(
                          (stop: EntryPoint) => stop.value === newEntry.value,
                        );

                        if (!isDuplicate) {
                          updateValue("number_of_stops", [
                            ...currentStops,
                            newEntry,
                          ]);
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-transparent border-border">
                      <SelectValue placeholder="Add bus-stops..." />
                    </SelectTrigger>
                    <SelectContent>
                      {busStops?.bus_stop.data
                        .filter(
                          (stop) =>
                            // 4. Update filter to check the 'value' property inside the objects
                            !updateWatch("number_of_stops")?.some(
                              (selected: EntryPoint) =>
                                selected.value ===
                                stop.location.value.toLowerCase(),
                            ),
                        )
                        .map((stop) => (
                          <SelectItem key={stop._id} value={stop._id}>
                            {stop.location.value}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* 2. Display Selected Bus-Stops as Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {updateWatch("number_of_stops")
                      ?.flat()
                      .map((stopValue, key) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span className="capitalize">{stopValue.value}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const current =
                                updateWatch("number_of_stops").flat();
                              updateValue(
                                "number_of_stops",
                                current.filter((s) => s !== stopValue),
                              );
                            }}
                            className="hover:bg-destructive hover:text-white rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
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
                  disabled
                  defaultValue={"Nigeria"}
                  placeholder="Enter country"
                />
              </div>
              <Button
                disabled={modifyTripRoute.isPending || holdEditPickupBtn}
                onClick={handleModifyPickupStation}
                className={`w-full bg-primary ${
                  modifyTripRoute.isPending || holdEditPickupBtn
                    ? "opacity-30"
                    : ""
                } hover:bg-primary/90 text-primary-foreground`}
              >
                {modifyTripRoute.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Edit {title.slice(0, -1)}</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* End Pickup Address Edit Modal */}

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
