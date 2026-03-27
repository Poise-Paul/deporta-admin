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
  AddTripRoute,
  BusStopEntryPoint,
  EditTripRoute,
  WeekdayType,
} from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getRoutes,
  useCreateTripRoute,
  useDeleteRoute,
  useModifyRoutes,
} from "@/api/routes";
import { getAllBusStops } from "@/api/bus-stops";
import { updateSelRoute } from "@/lib/store/slices/route-slice";
import { getDropOffStations } from "@/api/drop-off-locations";
import { Switch } from "../ui/switch";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

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

  const [routeId, setRouteId] = useState<EditTripRoute | null>(null);

  const [holdBtn, setHoldBtn] = useState(true);
  const [holdEditPickupBtn, setHoldEditPickupBtn] = useState(true);

  const addTripRoute = useCreateTripRoute();
  const modifyTripRoute = useModifyRoutes();

  const deleteMutation = useDeleteRoute();

  // Locations Filter
  const [openPickup, setOpenPickup] = useState(false);
  const [openDropOff, setOpenDropOff] = useState(false);
  const [openBusStop, setOpenBusStop] = useState(false);

  const [pickupSearch, setPickupSearch] = useState("");
  const [dropoffSearch, setDropOffSearch] = useState("");
  const [busStopSearch, setBusStopSearch] = useState("");

  // End Locations Filter

  const {
    data: tripRoutes,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });

  type Day =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  const days: Day[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const initialDay: WeekdayType = {
    active: false,
    value: [],
  };

  const defaultRoutine = {
    monday: { active: false, value: [] },
    tuesday: { active: false, value: [] },
    wednesday: { active: false, value: [] },
    thursday: { active: false, value: [] },
    friday: { active: false, value: [] },
    saturday: { active: false, value: [] },
    sunday: { active: false, value: [] },
  };

  const { register, reset, setValue, watch } = useForm<AddTripRoute>({
    values: {
      rate: 0,
      flat_rate: 0,
      rate_per_km: 0,
      code: "",
      destination: { value: "", coordinates: [0, 0], location_id: "" },
      starting_point: { value: "", coordinates: [0, 0], location_id: "" },
      route_distance: "",
      number_of_stops: [],
      country: "Nigeria",
      state: "lagos",
      routine: {
        monday: { active: false, value: [] },
        tuesday: { active: false, value: [] },
        wednesday: { active: false, value: [] },
        thursday: { active: false, value: [] },
        friday: { active: false, value: [] },
        saturday: { active: false, value: [] },
        sunday: { active: false, value: [] },
      },
    },
  });

  // ...initialDay

  const {
    register: updateRegister,
    setValue: updateValue,
    watch: updateWatch,
    getValues: updateGetValues,
  } = useForm<AddTripRoute>({
    values: {
      rate: Number(routeId?.rate),
      flat_rate: Number(routeId?.flat_rate),
      rate_per_km: Number(routeId?.rate_per_km),
      code: `${routeId?.code}`,
      routine: routeId?.routine ?? defaultRoutine,

      destination: {
        value: routeId?.destination.value || "",
        location_id: routeId?.destination.location_id || "",
        coordinates: routeId?.destination.coordinates || [0, 0],
      },
      starting_point: {
        value: routeId?.starting_point.value || "",
        location_id: routeId?.starting_point.location_id || "",
        coordinates: routeId?.starting_point.coordinates || [0, 0],
      },
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
    const formData = watch();

    (Object.keys(formData.routine) as Day[]).forEach((day) => {
      if (formData.routine[day].active) {
        formData.routine[day].value = formData.routine[day].value.map(
          (slot) => ({
            from: `${new Date().toISOString().split("T")[0]}T${slot.from}:00`, // add "T"
            too: `${new Date().toISOString().split("T")[0]}T${slot.too}:00`, // fix typo: "too" -> "to"
            // status: slot.status,
          }),
        );
      }
    });

    console.log("Form Data >>>", formData);

    addTripRoute.mutate(formData, {
      onSuccess: () => {
        reset();
        refetch();
      },
      onSettled: () => setIsAddDialogOpen(false),
    });
  };

  // Old Routing data formatter

  // const handleRouteUpdate = () => {
  //   // const formData = watch();

  //   const formData = updateGetValues();
  //   // const updatedRoutine = { ...formData.routine };
  //   const updatedRoutine = JSON.parse(JSON.stringify(formData.routine));

  //   // New Routine Setup
  //   (Object.keys(updatedRoutine) as Array<keyof typeof updatedRoutine>).forEach(
  //     (day) => {
  //       if (updatedRoutine[day].active) {
  //         updatedRoutine[day].value = updatedRoutine[day].value.map(
  //           (slot: any) => ({
  //             // ...slot,
  //             from: convertToISO(slot.from),
  //             too: convertToISO(slot.too),
  //           }),
  //         );
  //       } else {
  //         // Optional: If active is false, ensure the array is completely empty
  //         updatedRoutine[day].value = [];
  //       }
  //     },
  //   );

  //   modifyTripRoute.mutate(
  //     {
  //       trip_route_id: routeId?.trip_route_id || "",
  //       rate: formData.rate, // 🔑 Pull directly from formData to ensure sync
  //       rate_per_km: formData.rate_per_km,
  //       code: formData.code,
  //       flat_rate: formData.flat_rate,
  //       destination: formData.destination,
  //       starting_point: formData.starting_point,
  //       route_distance: formData.route_distance,
  //       number_of_stops: formData.number_of_stops,
  //       country: formData.country,
  //       state: formData.state,
  //       routine: updatedRoutine,
  //     },
  //     {
  //       onSuccess: () => refetch(),
  //       onSettled: () => setIsEditDialogOpen(false),
  //     },
  //   );
  // };

  const handleModifyRoute = () => {
    const formData = updateGetValues();
    const updatedRoutine = JSON.parse(JSON.stringify(formData.routine));
    
    (Object.keys(updatedRoutine) as Array<keyof typeof updatedRoutine>).forEach(
      (day) => {
        if (updatedRoutine[day].active) {
          updatedRoutine[day].value = updatedRoutine[day].value.map(
            (slot: any) => {
              // 🔑 Use setUTCHours to prevent the timezone from shifting into the previous day
              const fromDate = new Date();
              const [fromH, fromM] = slot.from.split(":");
              fromDate.setUTCHours(parseInt(fromH), parseInt(fromM), 0, 0);

              const tooDate = new Date();
              const [tooH, tooM] = slot.too.split(":");
              tooDate.setUTCHours(parseInt(tooH), parseInt(tooM), 0, 0);

              // 🔑 Overnight Guard (Updated to use UTC date logic)
              if (tooDate <= fromDate) {
                tooDate.setUTCDate(tooDate.getUTCDate() + 1);
              }

              return {
                // ...slot,
                from: fromDate.toISOString(),
                too: tooDate.toISOString(),
              };
            },
          );
        } else {
          updatedRoutine[day].value = [];
        }
      },
    );

    modifyTripRoute.mutate(
      {
        trip_route_id: routeId?.trip_route_id || "",
        rate: formData.rate,
        rate_per_km: formData.rate_per_km,
        code: formData.code,
        flat_rate: formData.flat_rate,
        destination: formData.destination,
        starting_point: formData.starting_point,
        route_distance: formData.route_distance,
        number_of_stops: formData.number_of_stops,
        country: formData.country,
        state: formData.state,
        routine: updatedRoutine,
      },
      {
        // Reset the UI using formData (which retains the nice HH:mm times)
        onSuccess: () => reset(formData),
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

  const {
    data: pickupStations,
    fetchNextPage: fetchNextPickupPage,
    hasNextPage: hasNextPickupPage,
    isFetchingNextPage: isFetchingMorePickups,
    isLoading: pickupLoader,
  } = useInfiniteQuery({
    queryKey: ["pickupStations", pickupSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getPickupStations(pageParam, 10, pickupSearch),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.pickup_station?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
  });

  const {
    data: dropOffStations,
    fetchNextPage: fetchNextDropOffPage,
    hasNextPage: hasNextDropOffPage,
    isFetchingNextPage: isFetchingMoreDropOffs,
    isLoading: dropOffLoader,
  } = useInfiniteQuery({
    queryKey: ["dropOffStations", dropoffSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getDropOffStations(pageParam, 10, dropoffSearch),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages =
        lastPage?.drop_off_station?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
  });

  const {
    data: busStops,
    fetchNextPage: fetchNextBusStopPage,
    hasNextPage: hasNextBusStopPage,
    isFetchingNextPage: isFetchingMoreBusStops,
    isLoading: busStopLoader,
  } = useInfiniteQuery({
    queryKey: ["busStops", busStopSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getAllBusStops(pageParam, 10, busStopSearch),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.bus_stop?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages?.length + 1 : undefined;
    },
  });

  const router = useRouter();
  const dispatch = useDispatch();

  // Flatten all data
  const allPickupStations =
    pickupStations?.pages.flatMap((page) => page?.pickup_station?.data || []) ||
    [];

  const allDropOffStations =
    dropOffStations?.pages.flatMap(
      (page) => page?.drop_off_station?.data || [],
    ) || [];

  const allBusStops =
    busStops?.pages.flatMap((page) => page?.bus_stop?.data || []) || [];

  // Calculate Distance

  const calculateDistance = (origin: string, destination: string) => {
    // 🔑 More robust check for the specific library needed
    if (
      typeof window === "undefined" ||
      !window.google?.maps?.DistanceMatrixService
    ) {
      console.log("Google Maps library not yet loaded");
      return;
    }

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (
          status === "OK" &&
          response &&
          response.rows[0].elements[0].status !== "ZERO_RESULTS"
        ) {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);

          // 🔑 Use setValue, not watch, to update the form state
          setValue("route_distance", distanceInKm);
        }
      },
    );
  };
  useEffect(() => {
    if (starting_point?.value && destination?.value) {
      // 🔑 Ensure we don't call Google if it's not ready
      if (typeof window !== "undefined" && window.google) {
        const delayDebounceFn = setTimeout(() => {
          calculateDistance(starting_point.value, destination.value);
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
      }
    }
  }, [starting_point, destination]);

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
              <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col p-">
                <DialogHeader>
                  <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6 pt-2">
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

                    <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                      <Label className="text-primary font-bold">
                        Starting Point
                      </Label>

                      {/* <Select
                        onValueChange={(id) => {
                          // Search in the same data source you used for the list!
                          const station = allPickupStations?.find(
                            (s) => s._id === id,
                          );

                          if (station) {
                            setValue("starting_point", {
                              // Use 'address' because that's what your map uses below
                              value: station.address.value.toLowerCase(),
                              location_id: station._id,
                              coordinates: station.address.location.coordinates,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue
                            placeholder={
                              watch("starting_point.value") ||
                              "Select Pickup Location"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {allPickupStations.map((stop) => (
                            <SelectItem key={stop._id} value={stop._id}>
                              {stop.address.value}
                            </SelectItem>
                          ))}
                          {hasNextPickupPage && (
                            <Button
                              variant="ghost"
                              className="w-full text-sm mt-2"
                              onClick={(e) => {
                                e.preventDefault(); // Stop dropdown from closing
                                fetchNextPickupPage();
                              }}
                              disabled={isFetchingMorePickups}
                            >
                              {isFetchingMorePickups
                                ? "Loading..."
                                : "Load More"}
                            </Button>
                          )}
                        </SelectContent>
                      </Select> */}

                      {/* New Test */}
                      <Popover open={openPickup} onOpenChange={setOpenPickup}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPickup}
                            className="w-full justify-between bg-background font-normal"
                          >
                            <span className="truncate">
                              {watch("starting_point.value") ||
                                "Select Pickup Location"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        {/* Match the width of the trigger button exactly */}
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search pickup locations..."
                              value={pickupSearch}
                              onValueChange={(text) => setPickupSearch(text)}
                            />
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {allPickupStations?.map((stop) => (
                                <CommandItem
                                  key={stop._id}
                                  value={stop.address.value} // cmdk filters by this value
                                  onSelect={() => {
                                    setValue("starting_point", {
                                      value: stop.address.value.toLowerCase(),
                                      location_id: stop._id,
                                      coordinates:
                                        stop.address.location.coordinates,
                                    });
                                    setOpenPickup(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      watch("starting_point.location_id") ===
                                        stop._id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {stop.address.value}
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            {/* Load More Button inside the Popover but outside the scrolling Group */}
                            {hasNextPickupPage && (
                              <div className="p-1 border-t">
                                <Button
                                  variant="ghost"
                                  className="w-full text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    fetchNextPickupPage();
                                  }}
                                  disabled={isFetchingMorePickups}
                                >
                                  {isFetchingMorePickups
                                    ? "Loading..."
                                    : "Load More"}
                                </Button>
                              </div>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                      <Label className="text-primary font-bold">
                        Destination
                      </Label>

                      {/* <Select
                        onValueChange={(id) => {
                          const station = allDropOffStations.find(
                            (s) => s._id === id,
                          );

                          if (station) {
                            setValue("destination", {
                              value: station.address.value.toLowerCase(),
                              location_id: station._id,
                              coordinates: station.address.location.coordinates,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue
                            placeholder={
                              watch("destination.value") ||
                              "Select Drop Off Location"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {allDropOffStations.map((stop) => (
                            <SelectItem key={stop._id} value={stop._id}>
                              {stop.address.value}
                            </SelectItem>
                          ))}
                          {hasNextDropOffPage && (
                            <Button
                              variant="ghost"
                              className="w-full text-sm mt-2"
                              onClick={(e) => {
                                e.preventDefault(); // Stop dropdown from closing
                                fetchNextDropOffPage();
                              }}
                              disabled={isFetchingMoreDropOffs}
                            >
                              {isFetchingMoreDropOffs
                                ? "Loading..."
                                : "Load More"}
                            </Button>
                          )}
                        </SelectContent>
                      </Select> */}

                      <Popover open={openDropOff} onOpenChange={setOpenDropOff}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDropOff}
                            className="w-full justify-between bg-background font-normal"
                          >
                            <span className="truncate">
                              {watch("destination.value") ||
                                "Select Drop Off Location"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search drop off locations..."
                              value={dropoffSearch}
                              onValueChange={(text) => setDropOffSearch(text)}
                            />
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {allDropOffStations?.map((stop) => (
                                <CommandItem
                                  key={stop._id}
                                  value={stop.address.value}
                                  onSelect={() => {
                                    setValue("destination", {
                                      value: stop.address.value.toLowerCase(),
                                      location_id: stop._id,
                                      coordinates:
                                        stop.address.location.coordinates,
                                    });
                                    setOpenDropOff(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      watch("destination.location_id") ===
                                        stop._id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {stop.address.value}
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            {hasNextDropOffPage && (
                              <div className="p-1 border-t">
                                <Button
                                  variant="ghost"
                                  className="w-full text-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    fetchNextDropOffPage();
                                  }}
                                  disabled={isFetchingMoreDropOffs}
                                >
                                  {isFetchingMoreDropOffs
                                    ? "Loading..."
                                    : "Load More"}
                                </Button>
                              </div>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Weekly SAcheduler */}
                    <div className="space-y-4 border-t pt-4">
                      <Label className="text-lg font-bold">
                        Weekly Operating Schedule
                      </Label>

                      {days.map((day) => (
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
                                        value={slot.from ?? ""}
                                        onChange={(e) => {
                                          const newFrom = e.target.value;
                                          const currentRoutine = [
                                            ...watch(`routine.${day}.value`),
                                          ];

                                          // 🔑 1. Check for Duplicates (Excluding the current index being edited)
                                          const isDuplicate =
                                            currentRoutine.some(
                                              (s, i) =>
                                                i !== index &&
                                                s.from === newFrom &&
                                                s.too === slot.too,
                                            );

                                          if (isDuplicate) {
                                            toast.error(
                                              "This exact time slot already exists.",
                                            );
                                            return; // Block the update
                                          }

                                          // 🔑 2. Prevent "From" from being after or equal to "Too"
                                          if (newFrom >= slot.too) {
                                            toast.error(
                                              "Departure must be before arrival.",
                                            );
                                            return; // Block the update
                                          }

                                          currentRoutine[index].from = newFrom;
                                          setValue(
                                            `routine.${day}.value`,
                                            currentRoutine,
                                          );
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-[10px]">
                                        Arrival (Too)
                                      </Label>
                                      <Input
                                        type="time"
                                        value={slot.too}
                                        onChange={(e) => {
                                          const newToo = e.target.value;
                                          const currentRoutine = [
                                            ...watch(`routine.${day}.value`),
                                          ];

                                          // 🔑 1. Check for Duplicates
                                          const isDuplicate =
                                            currentRoutine.some(
                                              (s, i) =>
                                                i !== index &&
                                                s.from === slot.from &&
                                                s.too === newToo,
                                            );

                                          if (isDuplicate) {
                                            toast.error(
                                              "This exact time slot already exists.",
                                            );
                                            return;
                                          }

                                          // 🔑 2. Prevent "Too" from being before or equal to "From"
                                          if (newToo <= slot.from) {
                                            toast.error(
                                              "Arrival must be after departure.",
                                            );
                                            return;
                                          }

                                          currentRoutine[index].too = newToo;
                                          setValue(
                                            `routine.${day}.value`,
                                            currentRoutine,
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
                                        setValue(
                                          `routine.${day}.value`,
                                          current,
                                        );
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

                                  // 🔑 1. Determine the dynamic default start time
                                  let defaultFrom = "08:00";
                                  if (current.length > 0) {
                                    const lastSlot =
                                      current[current.length - 1];
                                    const [lastHour] = lastSlot.too.split(":");
                                    // Increment hour by 1 and wrap around if it exceeds 23
                                    const nextHour =
                                      (parseInt(lastHour) + 1) % 24;
                                    defaultFrom = `${nextHour.toString().padStart(2, "0")}:00`;
                                  }

                                  // 🔑 2. Set arrival to 1 hour after the new departure
                                  const [newHour] = defaultFrom.split(":");
                                  const defaultToo = `${((parseInt(newHour) + 1) % 24).toString().padStart(2, "0")}:00`;

                                  const newSlot = {
                                    from: defaultFrom,
                                    too: defaultToo,
                                    status: "pending",
                                  };

                                  // 🔑 3. Final safety check (should never fail with dynamic times)
                                  const isDuplicate = current.some(
                                    (s) =>
                                      s.from === newSlot.from &&
                                      s.too === newSlot.too,
                                  );

                                  if (isDuplicate) {
                                    toast.error(
                                      `Please adjust existing slots before adding more for ${day}`,
                                    );
                                    return;
                                  }

                                  setValue(`routine.${day}.value`, [
                                    ...current,
                                    newSlot,
                                  ]);
                                }}
                              >
                                <Plus size={12} className="mr-1" /> Add Time
                                Slot
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
                          {...register("route_distance")}
                          placeholder="Calculating distance..."
                          readOnly
                          className="bg-muted/50 cursor-not-allowed rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                        {/* <Select
                          value=""
                          onValueChange={(id) => {
                            const selectedStop = allBusStops?.find(
                              (s) => s._id === id,
                            );

                            if (selectedStop) {
                              const currentStops =
                                watch("number_of_stops") || [];

                              const newEntry: BusStopEntryPoint = {
                                value: selectedStop.address.value.toLowerCase(),
                                location_id: selectedStop._id,
                                coordinates:
                                  selectedStop.address.location.coordinates,
                              };

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
                            {allBusStops
                              .filter(
                                (stop) =>
                                  !watch("number_of_stops")?.some(
                                    (s) =>
                                      s.value ===
                                      stop.address.value.toLowerCase(),
                                  ),
                              )
                              .map((stop) => (
                                <SelectItem key={stop._id} value={stop._id}>
                                  {stop.address.value}
                                </SelectItem>
                              ))}
                            {hasNextBusStopPage && (
                              <Button
                                variant="ghost"
                                className="w-full text-sm mt-2"
                                onClick={(e) => {
                                  e.preventDefault(); // Stop dropdown from closing
                                  fetchNextBusStopPage();
                                }}
                                disabled={isFetchingMoreBusStops}
                              >
                                {isFetchingMoreBusStops
                                  ? "Loading..."
                                  : "Load More"}
                              </Button>
                            )}
                          </SelectContent>
                        </Select> */}

                        <Popover
                          open={openBusStop}
                          onOpenChange={setOpenBusStop}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBusStop}
                              className="w-full justify-between bg-transparent font-normal"
                            >
                              <span className="text-muted-foreground">
                                Search and add bus-stops...
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search bus stops..."
                                value={busStopSearch}
                                onValueChange={(text) => setBusStopSearch(text)}
                              />
                              <CommandEmpty>No bus stops found.</CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-y-auto">
                                {allBusStops
                                  ?.filter(
                                    (stop) =>
                                      !watch("number_of_stops")?.some(
                                        (s) =>
                                          s.value ===
                                          stop.address.value.toLowerCase(),
                                      ),
                                  )
                                  .map((stop) => (
                                    <CommandItem
                                      key={stop._id}
                                      value={stop.address.value}
                                      onSelect={() => {
                                        const currentStops =
                                          watch("number_of_stops") || [];
                                        const newEntry = {
                                          value:
                                            stop.address.value.toLowerCase(),
                                          location_id: stop._id,
                                          coordinates:
                                            stop.address.location.coordinates,
                                        };
                                        setValue("number_of_stops", [
                                          ...currentStops,
                                          newEntry,
                                        ]);
                                        // Note: Intentionally NOT setting openBusStop to false here
                                        // so they can keep clicking to add multiple stops!
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />{" "}
                                      {/* Swapped Check for Plus */}
                                      {stop.address.value}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>

                              {hasNextBusStopPage && (
                                <div className="p-1 border-t">
                                  <Button
                                    variant="ghost"
                                    className="w-full text-sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      fetchNextBusStopPage();
                                    }}
                                    disabled={isFetchingMoreBusStops}
                                  >
                                    {isFetchingMoreBusStops
                                      ? "Loading..."
                                      : "Load More"}
                                  </Button>
                                </div>
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>

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
                  </div>
                </div>
                <div className="pt-4 border-t">
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
                    <td className="p-4 capitalize font-medium text-sm">
                      {station.starting_point.value}
                    </td>
                    <td className="p-4 capitalize text-sm text-muted-foreground">
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
                                destination: {
                                  value: station.destination.value,
                                  location_id: station._id,
                                  // 🔑 Extract coordinates from the nested location object
                                  coordinates:
                                    station.destination.location.coordinates,
                                },
                                starting_point: {
                                  value: station.starting_point.value,
                                  location_id: station._id,
                                  coordinates:
                                    station.starting_point.location.coordinates,
                                },
                                state: station.state,
                                country: station.country,
                                route_distance: station.route_distance,
                                // 🔑 Flatten the bus stops array to remove the 'location' wrapper
                                number_of_stops: station.number_of_stops.map(
                                  (stop: any) => ({
                                    value: stop.value,
                                    location_id: stop.location_id,
                                    coordinates: stop.location.coordinates,
                                  }),
                                ),
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
          {/* Added h-[90vh] and flex-col to match Add Route layout */}
          <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <div className="space-y-4 py-4">
                {/* Rate & Flat Rate with Naira Styling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_rate">Rate</Label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                        ₦
                      </span>
                      <Input
                        id="edit_rate"
                        type="number"
                        {...updateRegister("rate")}
                        className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter rate"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_flat_rate">Flat Rate</Label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                        ₦
                      </span>
                      <Input
                        id="edit_flat_rate"
                        type="number"
                        {...updateRegister("flat_rate")}
                        className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter Flat Rate"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate Per KM & Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_rate_per_km">Rate Per KM</Label>
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                        ₦
                      </span>
                      <Input
                        id="edit_rate_per_km"
                        type="number"
                        {...updateRegister("rate_per_km")}
                        className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter Rate Per Km"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_code">Code</Label>
                    <Input
                      id="edit_code"
                      {...updateRegister("code")}
                      placeholder="Enter code"
                    />
                  </div>
                </div>

                {/* Starting Point & Destination (Matches Add Modal Logic) */}
                {/* <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <Label className="text-primary font-bold">
                    Starting Point
                  </Label>
                  <Input
                    id="starting_point"
                    {...updateRegister("starting_point.value")}
                    readOnly
                    className="bg-background"
                  />
                </div> */}

                {/* <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <Label className="text-primary font-bold">Destination</Label>
                  <Input
                    id="destination"
                    {...updateRegister("destination.value")}
                    readOnly
                    className="bg-background"
                  />
                </div> */}

                {/* Starting Point (Edit Modal Version) */}
                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <Label className="text-primary font-bold">
                    Starting Point
                  </Label>
                  <Select
                    onValueChange={(id) => {
                      const station = allPickupStations?.find(
                        (s) => s._id === id,
                      );
                      if (station) {
                        updateValue("starting_point", {
                          value: station.address.value.toLowerCase(),
                          location_id: station._id,
                          coordinates: station.address.location.coordinates,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background w-full">
                      <SelectValue
                        placeholder={
                          updateWatch("starting_point.value") ||
                          "Select Pickup Location"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {allPickupStations?.map((station) => (
                        <SelectItem key={station._id} value={station._id}>
                          {station.address.value}
                        </SelectItem>
                      ))}

                      {/* Load more pickup stations */}
                      {hasNextPickupPage && (
                        <Button
                          variant="ghost"
                          className="w-full text-sm mt-2"
                          onClick={(e) => {
                            e.preventDefault(); // Stop dropdown from closing
                            fetchNextPickupPage();
                          }}
                          disabled={isFetchingMorePickups}
                        >
                          {isFetchingMorePickups ? "Loading..." : "Load More"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination (Edit Modal Version) */}
                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <Label className="text-primary font-bold">Destination</Label>
                  <Select
                    onValueChange={(id) => {
                      const station = allDropOffStations?.find(
                        (s) => s._id === id,
                      );
                      if (station) {
                        updateValue("destination", {
                          value: station.address.value.toLowerCase(),
                          location_id: station._id,
                          coordinates: station.address.location.coordinates,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background w-full">
                      <SelectValue
                        placeholder={
                          updateWatch("destination.value") ||
                          "Select Drop Off Location"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {allDropOffStations?.map((stop) => (
                        <SelectItem key={stop._id} value={stop._id}>
                          {stop.address.value}
                        </SelectItem>
                      ))}
                      {/* fetch more dropoffs */}
                      {hasNextDropOffPage && (
                        <Button
                          variant="ghost"
                          className="w-full text-sm mt-2"
                          onClick={(e) => {
                            e.preventDefault(); // Stop dropdown from closing
                            fetchNextDropOffPage();
                          }}
                          disabled={isFetchingMoreDropOffs}
                        >
                          {isFetchingMoreDropOffs ? "Loading..." : "Load More"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* --- NEW: Weekly Operating Schedule (Missing from your Edit version) --- */}
                {/* <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-bold">
                    Weekly Operating Schedule
                  </Label>
                  {days.map((day) => (
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
                            checked={updateWatch(`routine.${day}.active`)}
                            onCheckedChange={(val) =>
                              updateValue(`routine.${day}.active`, val)
                            }
                          />
                        </div>
                      </div>
                      {updateWatch(`routine.${day}.active`) && (
                        <div className="space-y-2">
                          {updateWatch(`routine.${day}.value`)?.map(
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
                                    value={formatISOToTime(slot.from)}
                                    onChange={(e) => {
                                      const newTime = e.target.value;
                                      const currentRoutine = [
                                        ...updateWatch(`routine.${day}.value`),
                                      ];

                                      // 🔑 1. Guard: Check for Duplicates
                                      const isDuplicate = currentRoutine.some(
                                        (s, i) =>
                                          i !== index &&
                                          formatISOToTime(s.from) === newTime &&
                                          formatISOToTime(s.too) ===
                                            formatISOToTime(slot.too),
                                      );
                                      if (isDuplicate) {
                                        toast.error(
                                          "This exact time slot already exists.",
                                        );
                                        return;
                                      }

                                      // 🔑 2. Guard: Departure must be before Arrival
                                      if (
                                        newTime >= formatISOToTime(slot.too)
                                      ) {
                                        toast.error(
                                          "Departure must be before arrival.",
                                        );
                                        return;
                                      }

                                      // currentRoutine[index].from =
                                      //   convertToISO(newTime);
                                      // updateValue(
                                      //   `routine.${day}.value`,
                                      //   currentRoutine,
                                      // );

                                      // 🔑 Create a completely new object for the specific slot so react-hook-form sees the change
                                      currentRoutine[index] = {
                                        ...currentRoutine[index],
                                        from: convertToISO(newTime),
                                      };
                                      // Update the value and optionally tell it to validate/dirty the field
                                      updateValue(
                                        `routine.${day}.value`,
                                        currentRoutine,
                                        { shouldDirty: true },
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">
                                    Arrival (Too)
                                  </Label>
                                  <Input
                                    type="time"
                                    value={formatISOToTime(slot.too)}
                                    onChange={(e) => {
                                      const newTime = e.target.value;
                                      const currentRoutine = [
                                        ...updateWatch(`routine.${day}.value`),
                                      ];

                                      // 🔑 1. Guard: Check for Duplicates
                                      const isDuplicate = currentRoutine.some(
                                        (s, i) =>
                                          i !== index &&
                                          formatISOToTime(s.from) ===
                                            formatISOToTime(slot.from) &&
                                          formatISOToTime(s.too) === newTime,
                                      );
                                      if (isDuplicate) {
                                        toast.error(
                                          "This exact time slot already exists.",
                                        );
                                        return;
                                      }

                                      // 🔑 2. Guard: Arrival must be after Departure
                                      if (
                                        newTime <= formatISOToTime(slot.from)
                                      ) {
                                        toast.error(
                                          "Arrival must be after departure.",
                                        );
                                        return;
                                      }

                                      // currentRoutine[index].too =
                                      //   convertToISO(newTime);
                                      // updateValue(
                                      //   `routine.${day}.value`,
                                      //   currentRoutine,
                                      // );

                                      // 🔑 Create a completely new object for the specific slot so react-hook-form sees the change
                                      currentRoutine[index] = {
                                        ...currentRoutine[index],
                                        too: convertToISO(newTime),
                                      };
                                      // Update the value and optionally tell it to validate/dirty the field
                                      updateValue(
                                        `routine.${day}.value`,
                                        currentRoutine,
                                        { shouldDirty: true },
                                      );
                                    }}
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    const current = updateWatch(
                                      `routine.${day}.value`,
                                    ).filter((_, i) => i !== index);
                                    updateValue(
                                      `routine.${day}.value`,
                                      current,
                                    );
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
                                updateWatch(`routine.${day}.value`) || [];
                              let defaultFrom = "08:00";

                              if (current.length > 0) {
                                const lastSlot = current[current.length - 1];
                                const lastHour = formatISOToTime(
                                  lastSlot.too,
                                ).split(":")[0];
                                const nextHour = (parseInt(lastHour) + 1) % 24;
                                defaultFrom = `${nextHour.toString().padStart(2, "0")}:00`;
                              }

                              const nextHourAfterFrom =
                                (parseInt(defaultFrom.split(":")[0]) + 1) % 24;
                              const defaultToo = `${nextHourAfterFrom.toString().padStart(2, "0")}:00`;

                              updateValue(`routine.${day}.value`, [
                                ...current,
                                {
                                  from: convertToISO(defaultFrom),
                                  too: convertToISO(defaultToo),
                                  // status: "pending",
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
                </div> */}

                <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-bold">
                    Weekly Operating Schedule
                  </Label>
                  {days.map((day) => {
                    const active = updateWatch(`routine.${day}.active`);
                    const slots = updateWatch(`routine.${day}.value`) || [];

                    return (
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
                              checked={active}
                              onCheckedChange={(val) =>
                                updateValue(`routine.${day}.active`, val, {
                                  shouldDirty: true,
                                })
                              }
                            />
                          </div>
                        </div>

                        {active && (
                          <div className="space-y-2">
                            {slots.map((slot: any, index: number) => (
                              <div
                                key={index}
                                className="grid grid-cols-3 gap-2 items-end bg-background p-2 rounded border"
                              >
                                {/* Departure Input */}
                                <div>
                                  <Label className="text-[10px]">
                                    Departure (From)
                                  </Label>
                                  <Input
                                    type="time"
                                    value={slot.from} // 🔑 Removed formatISOToTime
                                    onChange={(e) => {
                                      const newTime = e.target.value;
                                      const currentRoutine = [...slots];

                                      // 🔑 1. Guard: Check for Duplicates (Simplified)
                                      const isDuplicate = currentRoutine.some(
                                        (s, i) =>
                                          i !== index &&
                                          s.from === newTime &&
                                          s.too === slot.too,
                                      );
                                      if (isDuplicate) {
                                        toast.error(
                                          "This exact time slot already exists.",
                                        );
                                        return;
                                      }

                                      // 🔑 2. Guard: Departure must be before Arrival (Simplified)
                                      // Only check if slot.too exists and isn't empty
                                      if (slot.too && newTime >= slot.too) {
                                        toast.error(
                                          "Departure must be before arrival.",
                                        );
                                        return;
                                      }

                                      currentRoutine[index] = {
                                        ...currentRoutine[index],
                                        from: newTime, // 🔑 Removed convertToISO
                                      };

                                      updateValue(
                                        `routine.${day}.value`,
                                        currentRoutine,
                                        {
                                          shouldDirty: true,
                                        },
                                      );
                                    }}
                                  />
                                </div>

                                {/* Arrival Input */}
                                <div>
                                  <Label className="text-[10px]">
                                    Arrival (To)
                                  </Label>
                                  <Input
                                    type="time"
                                    value={slot.too} // 🔑 Removed formatISOToTime
                                    onChange={(e) => {
                                      const newTime = e.target.value;
                                      const currentRoutine = [...slots];

                                      // 🔑 1. Guard: Check for Duplicates (Simplified)
                                      const isDuplicate = currentRoutine.some(
                                        (s, i) =>
                                          i !== index &&
                                          s.from === slot.from &&
                                          s.too === newTime,
                                      );
                                      if (isDuplicate) {
                                        toast.error(
                                          "This exact time slot already exists.",
                                        );
                                        return;
                                      }

                                      // 🔑 2. Guard: Arrival must be after Departure (Simplified)
                                      if (slot.from && newTime <= slot.from) {
                                        toast.error(
                                          "Arrival must be after departure.",
                                        );
                                        return;
                                      }

                                      currentRoutine[index] = {
                                        ...currentRoutine[index],
                                        too: newTime, // 🔑 Removed convertToISO
                                      };

                                      updateValue(
                                        `routine.${day}.value`,
                                        currentRoutine,
                                        {
                                          shouldDirty: true,
                                        },
                                      );
                                    }}
                                  />
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    const current = slots.filter(
                                      (_: any, i: number) => i !== index,
                                    );
                                    updateValue(
                                      `routine.${day}.value`,
                                      current,
                                      { shouldDirty: true },
                                    );
                                  }}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ))}

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                let defaultFrom = "08:00";

                                if (slots.length > 0) {
                                  const lastSlot = slots[slots.length - 1];
                                  const lastHour = parseInt(
                                    lastSlot.too.split(":")[0],
                                    10,
                                  );
                                  const nextHour = (lastHour + 1) % 24;
                                  defaultFrom = `${nextHour.toString().padStart(2, "0")}:00`;
                                }

                                const nextHourAfterFrom =
                                  (parseInt(defaultFrom.split(":")[0], 10) +
                                    1) %
                                  24;
                                const defaultToo = `${nextHourAfterFrom.toString().padStart(2, "0")}:00`;

                                updateValue(
                                  `routine.${day}.value`,
                                  [
                                    ...slots,
                                    {
                                      from: defaultFrom, // 🔑 Removed convertToISO
                                      too: defaultToo, // 🔑 Removed convertToISO
                                    },
                                  ],
                                  { shouldDirty: true },
                                );
                              }}
                            >
                              <Plus size={12} className="mr-1" /> Add Time Slot
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* End Weekly appointment Schedule */}

                {/* Route Distance with Unit Suffix */}
                <div className="space-y-2">
                  <Label htmlFor="edit_route_distance">Route Distance</Label>
                  <div className="flex rounded-md shadow-sm">
                    <Input
                      id="edit_route_distance"
                      {...updateRegister("route_distance")}
                      readOnly
                      className="bg-muted/50 cursor-not-allowed rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border bg-muted text-muted-foreground text-xs font-semibold">
                      KM
                    </span>
                  </div>
                </div>

                {/* Bus Stops Logic (Corrected Filter) */}
                {busStops && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Select Bus-Stops Along this Route
                    </Label>
                    <Select
                      value=""
                      onValueChange={(id) => {
                        const selectedStop = allBusStops?.find(
                          (s) => s._id === id,
                        );
                        if (selectedStop) {
                          const currentStops =
                            updateWatch("number_of_stops") || [];

                          const newEntry: BusStopEntryPoint = {
                            value: selectedStop.address.value.toLowerCase(),
                            location_id: selectedStop._id,
                            coordinates:
                              selectedStop.address.location.coordinates,
                          };
                          if (
                            !currentStops.some(
                              (s) => s.value === newEntry.value,
                            )
                          ) {
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
                        {allBusStops
                          .filter(
                            (stop) =>
                              !updateWatch("number_of_stops")?.some(
                                (s) =>
                                  s.value === stop.address.value.toLowerCase(),
                              ),
                          )
                          .map((stop) => (
                            <SelectItem key={stop._id} value={stop._id}>
                              {stop.address.value}
                            </SelectItem>
                          ))}
                        {/* Has More BusStops */}
                        {hasNextBusStopPage && (
                          <Button
                            variant="ghost"
                            className="w-full text-sm mt-2"
                            onClick={(e) => {
                              e.preventDefault(); // Stop dropdown from closing
                              fetchNextBusStopPage();
                            }}
                            disabled={isFetchingMoreBusStops}
                          >
                            {isFetchingMoreBusStops
                              ? "Loading..."
                              : "Load More"}
                          </Button>
                        )}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {updateWatch("number_of_stops")?.map((stopValue, key) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span className="capitalize">{stopValue.value}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const current = updateWatch("number_of_stops");
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

                {/* State & Country */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">State</Label>
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
                  <Label htmlFor="edit_country">Country</Label>
                  <Input
                    id="edit_country"
                    {...updateRegister("country")}
                    disabled
                    defaultValue={"Nigeria"}
                  />
                </div>
              </div>
            </div>

            {/* Footer Action Button */}
            <div className="pt-4 p-6 border-t bg-background">
              <Button
                disabled={modifyTripRoute.isPending || holdEditPickupBtn}
                onClick={handleModifyRoute}
                className={`w-full bg-primary ${modifyTripRoute.isPending || holdEditPickupBtn ? "opacity-30" : ""} hover:bg-primary/90 text-primary-foreground`}
              >
                {modifyTripRoute.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Save Changes</>
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
