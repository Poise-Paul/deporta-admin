"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Globe,
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit,
  X,
  RadioTower,
  Code,
  Route,
  Pin,
  Flag,
  Tag,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  AddPickupStationPayload,
  AddTripRoute,
  BusStopEntryPoint,
  EntryPoint,
  WeekdayType,
} from "@/types";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteRoute, useModifyRoutes } from "@/api/routes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllBusStops } from "@/api/bus-stops";
import { getDropOffStations } from "@/api/drop-off-locations";
import { getPickupStations } from "@/api/pick-up-stations";

interface StationDetailProps {
  onBack: () => void;
}

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

export function RouteDetails({ onBack }: StationDetailProps) {
  const { selRoute } = useSelector((state: RootState) => state.routes);
  const isActive = selRoute?.status === "active";

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [holdBtn, setHoldBtn] = useState(true);

  const deleteMutation = useDeleteRoute();

  const router = useRouter();

  // Pickup station Settings
  const [pickupCurrentPage, setPickupCurrentPage] = useState(1);
  const [pickupPages, setPickupPages] = useState(10);

  // Drop-Off Locations
  const [dropOffCurrentPage, setDropOffCurrentPage] = useState(1);
  const [dropOffPages, setDropOffPages] = useState(10);

  const handleDeleteRoute = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSettled: () => router.push("/app-menu/routes"),
    });
  };

  const { register, setValue, watch, reset, getValues } = useForm<AddTripRoute>(
    {
      defaultValues: {
        rate: Number(selRoute?.rate),
        flat_rate: Number(selRoute?.flat_rate),
        rate_per_km: Number(selRoute?.rate_per_km),
        routine: selRoute?.routine ?? defaultRoutine,
        code: `${selRoute?.code}`,
        destination: {
          value: selRoute?.destination?.value || "",
          location_id: selRoute?.destination.location_id,
          coordinates: selRoute?.destination.location.coordinates,
        },
        starting_point: {
          value: selRoute?.starting_point?.value || "",
          location_id: selRoute?.destination.location_id,
          coordinates: selRoute?.starting_point.location.coordinates,
        },
        route_distance: `${selRoute?.route_distance}`,
        number_of_stops: selRoute?.number_of_stops.map((stop: any) => ({
          value: stop.value,
          location_id: stop.location_id,
          coordinates: stop.location.coordinates,
        })),
        country: selRoute?.country || "Nigeria",
        state:
          selRoute?.state === "Lagos State" || "Lagos"
            ? "lagos"
            : selRoute?.state || "",
      },
    },
  );

  const modifyTripRoute = useModifyRoutes();

  const {
    data: busStops,
    fetchNextPage: fetchNextBusStopPage,
    hasNextPage: hasNextBusStopPage,
    isFetchingNextPage: isFetchingMoreBusStops,
  } = useInfiniteQuery({
    queryKey: ["busStops"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getAllBusStops(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.bus_stop?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages?.length + 1 : undefined;
    },
  });

  const {
    data: pickupStations,
    fetchNextPage: fetchNextPickupPage,
    hasNextPage: hasNextPickupPage,
    isFetchingNextPage: isFetchingMorePickups,
  } = useInfiniteQuery({
    queryKey: ["pickupStations"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPickupStations(pageParam, 10),
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
  } = useInfiniteQuery({
    queryKey: ["dropOffStations"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getDropOffStations(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages =
        lastPage?.drop_off_station?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
  });

  const handleWatch = watch();
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
    routine,
  } = handleWatch;

  const handleModifyRoute = () => {
    const formData = getValues();
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

    if (!selRoute) return;

    modifyTripRoute.mutate(
      {
        trip_route_id: selRoute._id,
        rate,
        flat_rate,
        rate_per_km,
        code,
        destination,
        starting_point,
        state,
        country,
        route_distance,
        number_of_stops,
        routine: updatedRoutine,
      },
      {
        // Reset the UI using formData (which retains the nice HH:mm times)
        onSuccess: () => reset(formData),
        onSettled: () => setIsEditDialogOpen(false),
      },
    );
  };

  useEffect(() => {
    if (
      rate &&
      flat_rate &&
      rate_per_km &&
      code &&
      destination &&
      starting_point &&
      state &&
      country &&
      route_distance &&
      number_of_stops
    ) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [
    rate,
    flat_rate,
    rate_per_km,
    code,
    destination,
    starting_point,
    state,
    country,
    route_distance,
    number_of_stops,
  ]);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  const selectedUpdateState = watch("state");

  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    // If it's already "HH:mm", just return it
    if (!timeString.includes("T")) {
      const [hours, minutes] = timeString.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }

    // Otherwise parse ISO and extract hours/minutes
    const date = new Date(timeString);
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatISOToTime = (isoOrTime: string) => {
    if (!isoOrTime) return "";
    if (isoOrTime.includes("T")) {
      const date = new Date(isoOrTime);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
    return isoOrTime; // already "HH:mm"
  };

  const convertToISO = (timeString: string) => {
    if (!timeString || timeString.includes("T")) return timeString;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toISOString();
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Routes
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Route
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Permanently delete this station?"))
                handleDeleteRoute(selRoute?._id || "");
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Route
          </Button>
        </div>
      </div>

      {selRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-border">
            <CardContent className="pt-8 text-center">
              <div className="h-20 w-20 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-secondary">
                <MapPin className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold px-4">
                {selRoute?.starting_point.value}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {selRoute?.destination.value}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  isActive
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-orange-500 text-orange-600 bg-orange-50",
                )}
              >
                {isActive ? "Active Station" : "In-active Station"}
              </Badge>
            </CardContent>
            <Separator className="my-6" />
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />{" "}
                <span>
                  {selRoute.state}, {selRoute.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />{" "}
                <span>
                  Added by: {selRoute.added_by.first_name}{" "}
                  {selRoute.added_by.last_name}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Route Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="Rate"
                value={`₦${selRoute.rate.toLocaleString()}`}
                icon={<RadioTower />}
              />
              <InfoItem
                label="Flat Rate"
                value={`₦${selRoute.flat_rate.toLocaleString()}`}
                icon={<Tag />}
              />
              <InfoItem
                label="Rate Per KM"
                value={`₦${selRoute.rate_per_km.toLocaleString()}`}
                icon={<Route />}
              />
              <InfoItem
                label="Code"
                value={`${selRoute.code}`}
                icon={<Code />}
              />
              <InfoItem
                label="Starting Point"
                value={`${selRoute.starting_point.value}`}
                icon={<Pin />}
              />
              <InfoItem
                label="Destination"
                value={`${selRoute.destination.value}`}
                icon={<Flag />}
              />
              <InfoItem
                label="Route Distance"
                value={`${selRoute.route_distance} KM`}
                icon={<Flag />}
              />

              <InfoItem
                label={`Number Of Stops: ${
                  Array.isArray(selRoute?.number_of_stops)
                    ? selRoute.number_of_stops.length
                    : 0
                }`}
                icon={<Flag />}
                // 🔑 Change: Render a vertical list instead of a joined string
                value={
                  Array.isArray(selRoute?.number_of_stops) &&
                  selRoute.number_of_stops.length > 0 ? (
                    <div className="flex flex-col gap-2 mt-1">
                      {selRoute.number_of_stops.map(
                        (stop: any, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            {/* 🔑 The Orange Bullet Point from your screenshot */}
                            <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            <span className="text-sm capitalize font-semibold leading-tight">
                              {stop.value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    "No stops"
                  )
                }
              />
              <InfoItem label="State" value={selRoute.state} icon={<Globe />} />
              <InfoItem
                label="Country"
                value={selRoute.country}
                icon={<Globe />}
              />
              <InfoItem
                label="Date Created"
                value={new Date(selRoute.createdAt).toDateString()}
                icon={<Calendar />}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Route Trip Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {days.map((day) => {
                  const dayData = selRoute.routine[day];
                  const isActive = dayData?.active;

                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-xl border ${isActive ? "bg-card border-primary/20" : "bg-muted/30 opacity-60 border-transparent"}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold capitalize text-sm">{day}</h4>
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="text-[10px] h-5"
                        >
                          {isActive ? "Active" : "Closed"}
                        </Badge>
                      </div>

                      {isActive && dayData.value && dayData.value.length > 0 ? (
                        <div className="space-y-2">
                          {dayData.value.map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50"
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-primary/80" />
                                <span className="tracking-tight text-foreground">
                                  {formatTime(slot.from)}
                                </span>
                              </div>

                              <ArrowRight className="h-3 w-3 opacity-40" />

                              <div className="flex items-center gap-2">
                                <span className="tracking-tight text-foreground">
                                  {formatTime(slot.too)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">
                          No trips scheduled for this day.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Trip Route Modal */}

      {/* 2nd Edit modal */}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        {/* Added h-[90vh] and flex-col to match Add Route layout */}
        <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Edit Route Details</DialogTitle>
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
                      {...register("rate")}
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
                      {...register("flat_rate")}
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
                      {...register("rate_per_km")}
                      className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter Rate Per Km"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_code">Code</Label>
                  <Input
                    id="edit_code"
                    {...register("code")}
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
                <Label className="text-primary font-bold">Starting Point</Label>
                <Select
                  onValueChange={(id) => {
                    const station = allPickupStations?.find(
                      (s) => s._id === id,
                    );
                    if (station) {
                      setValue("starting_point", {
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
                    {/* Pickup Station Load Button */}
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
                        watch("destination.value") || "Select Drop Off Location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {allDropOffStations?.map((stop) => (
                      <SelectItem key={stop._id} value={stop._id}>
                        {stop.address.value}
                      </SelectItem>
                    ))}
                    {/* Load More Button */}
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
              <div className="space-y-4 border-t pt-4">
                <Label className="text-lg font-bold">
                  Weekly Operating Schedule
                </Label>
                {days.map((day) => {
                  const active = watch(`routine.${day}.active`);
                  const slots = watch(`routine.${day}.value`) || [];

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
                              setValue(`routine.${day}.active`, val, {
                                shouldDirty: true,
                              })
                            }
                          />
                        </div>
                      </div>

                      {active && (
                        <div className="space-y-2">
                          {slots.map((slot, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-2 items-end bg-background p-2 rounded border"
                            >
                              {/* Departure */}
                              <div>
                                <Label className="text-[10px]">
                                  Departure (From)
                                </Label>
                                <Input
                                  type="time"
                                  value={slot.from}
                                  onChange={(e) => {
                                    const newTime = e.target.value;
                                    const newSlots = slots.map((s, i) =>
                                      i === index ? { ...s, from: newTime } : s,
                                    );

                                    // Guard: departure must be before arrival
                                    if (newTime >= slot.too) {
                                      toast.error(
                                        "Departure must be before arrival.",
                                      );
                                      return;
                                    }

                                    // Guard: duplicate check
                                    const isDuplicate = newSlots.some(
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

                                    setValue(`routine.${day}.value`, newSlots, {
                                      shouldDirty: true,
                                    });
                                  }}
                                />
                              </div>

                              {/* Arrival */}
                              <div>
                                <Label className="text-[10px]">
                                  Arrival (To)
                                </Label>
                                <Input
                                  type="time"
                                  value={slot.too}
                                  onChange={(e) => {
                                    const newTime = e.target.value;
                                    const newSlots = slots.map((s, i) =>
                                      i === index ? { ...s, too: newTime } : s,
                                    );

                                    // Guard: arrival must be after departure
                                    if (newTime <= slot.from) {
                                      toast.error(
                                        "Arrival must be after departure.",
                                      );
                                      return;
                                    }

                                    // Guard: duplicate check
                                    const isDuplicate = newSlots.some(
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

                                    setValue(`routine.${day}.value`, newSlots, {
                                      shouldDirty: true,
                                    });
                                  }}
                                />
                              </div>

                              {/* Remove button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  const newSlots = slots.filter(
                                    (_, i) => i !== index,
                                  );
                                  setValue(`routine.${day}.value`, newSlots, {
                                    shouldDirty: true,
                                  });
                                }}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}

                          {/* Add new slot */}
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
                              const defaultToo = `${(
                                (parseInt(defaultFrom.split(":")[0], 10) + 1) %
                                24
                              )
                                .toString()
                                .padStart(2, "0")}:00`;

                              setValue(`routine.${day}.value`, [
                                ...slots,
                                { from: defaultFrom, too: defaultToo },
                              ]);
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
                    {...register("route_distance")}
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
                        const currentStops = watch("number_of_stops") || [];

                        const newEntry: BusStopEntryPoint = {
                          value: selectedStop.address.value.toLowerCase(),
                          location_id: selectedStop._id,
                          coordinates:
                            selectedStop.address.location.coordinates,
                        };
                        if (
                          !currentStops.some((s) => s.value === newEntry.value)
                        ) {
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
                                s.value === stop.address.value.toLowerCase(),
                            ),
                        )
                        .map((stop) => (
                          <SelectItem key={stop._id} value={stop._id}>
                            {stop.address.value}
                          </SelectItem>
                        ))}
                      {/* Load More Buttons */}
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
                          {isFetchingMoreBusStops ? "Loading..." : "Load More"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {watch("number_of_stops")?.map((stopValue, key) => (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="flex items-center gap-1 pl-2 pr-1 py-1"
                      >
                        <span className="capitalize">{stopValue.value}</span>
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

              {/* State & Country */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <Select
                  value={selectedUpdateState}
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
                <Label htmlFor="edit_country">Country</Label>
                <Input
                  id="edit_country"
                  {...register("country")}
                  disabled
                  defaultValue={"Nigeria"}
                />
              </div>
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="pt-4 p-6 border-t bg-background">
            <Button
              disabled={modifyTripRoute.isPending || holdBtn}
              onClick={handleModifyRoute}
              className={`w-full bg-primary ${modifyTripRoute.isPending || holdBtn ? "opacity-30" : ""} hover:bg-primary/90 text-primary-foreground`}
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
      <Toaster />
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </p>
        <div className="text-sm capitalize font-semibold">{value}</div>
      </div>
    </div>
  );
}
