"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { AddPickupStationPayload, AddTripRoute, EntryPoint } from "@/types";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteRoute, useModifyRoutes } from "@/api/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllBusStops } from "@/api/bus-stops";
import { getDropOffStations } from "@/api/drop-off-locations";
import { getPickupStations } from "@/api/pick-up-stations";

interface StationDetailProps {
  onBack: () => void;
}

export function RouteDetails({ onBack }: StationDetailProps) {
  const { selRoute } = useSelector((state: RootState) => state.routes);
  const isActive = selRoute?.status === "active";

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [holdBtn, setHoldBtn] = useState(true);

  const deleteMutation = useDeleteRoute();

  const router = useRouter();

  const handleDeleteRoute = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSettled: () => router.push("/app-menu/routes"),
    });
  };

  const { register, setValue, watch } = useForm<AddTripRoute>({
    defaultValues: {
      rate: Number(selRoute?.rate),
      flat_rate: Number(selRoute?.flat_rate),
      rate_per_km: Number(selRoute?.rate_per_km),
      code: `${selRoute?.code}`,
      destination: {
        value: selRoute?.destination?.value || "",
        latitude: selRoute?.destination?.latitude || 0,
        longitude: selRoute?.destination?.longitude || 0,
      },
      starting_point: {
        value: selRoute?.starting_point?.value || "",
        latitude: selRoute?.starting_point?.latitude || 0,
        longitude: selRoute?.starting_point?.longitude || 0,
      },
      route_distance: `${selRoute?.route_distance}`,
      number_of_stops: selRoute?.number_of_stops,
      country: selRoute?.country || "Nigeria",
      state:
        selRoute?.state === "Lagos State" || "Lagos"
          ? "lagos"
          : selRoute?.state || "",
    },
  });

  const selectedState = watch("state");

  const modifyTripRoute = useModifyRoutes();

  const { data: busStops } = useQuery({
    queryKey: ["busStops"],
    queryFn: () => getAllBusStops(),
  });

  const { data: pickupStations } = useQuery({
    queryKey: ["pickupStations"],
    queryFn: () => getPickupStations(),
  });

  const { data: dropOffStations } = useQuery({
    queryKey: ["dropOffStations"],
    queryFn: () => getDropOffStations(),
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
        routine,
      },
      {
        onSettled: () => setIsAddDialogOpen(false),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Routes
        </Button>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" /> Edit Route
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Route</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                      {/* Naira Symbol Prefix */}
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                        ₦
                      </span>

                      <Input
                        id="flat_rate"
                        type="number" // Ensures only numbers are entered
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
                      placeholder="Enter code"
                    />
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="starting_point">Starting Point</Label>
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

                  {/* Name Selection */}
                  <Select
                    value={watch("starting_point.value")}
                    onValueChange={(id) => {
                      const stop = busStops?.bus_stop.data.find(
                        (s) => s._id === id,
                      );
                      if (stop) {
                        setValue("starting_point", {
                          value: stop.location.value.toLowerCase(),
                          latitude: 0,
                          longitude: 0,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Starting Point..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pickupStations?.pickup_station.data.map((stop) => (
                        <SelectItem key={stop._id} value={stop._id}>
                          {stop.address.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Coordinate Overrides (Test Numbers) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Latitude
                      </span>
                      <Input
                        type="number"
                        step="any"
                        className="h-8 text-xs"
                        value={watch("starting_point.latitude")}
                        onChange={(e) =>
                          setValue(
                            "starting_point.latitude",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Longitude
                      </span>
                      <Input
                        type="number"
                        step="any"
                        className="h-8 text-xs"
                        value={watch("starting_point.longitude")}
                        onChange={(e) =>
                          setValue(
                            "starting_point.longitude",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    {...register("destination")}
                    placeholder="Enter Destination"
                  />
                </div> */}

                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <Label
                    className="text-primary font-bold"
                    htmlFor="destination"
                  >
                    Destination
                  </Label>

                  {/* Destination Name Selection */}
                  <Select
                    value={watch("destination.value")} // Bind to the 'value' string inside the object
                    onValueChange={(id) => {
                      // Find the stop in your master list
                      const stop = busStops?.bus_stop.data.find(
                        (s) => s._id === id,
                      );
                      if (stop) {
                        setValue("destination", {
                          value: stop.location.value.toLowerCase(),
                          latitude: 0, // Mock 0 if not present
                          longitude: 0, // Mock 0 if not present
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
                          {stop.address.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Coordinate Display for Destination */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Dest. Latitude
                      </span>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0.0000"
                        className="h-8 text-xs"
                        value={watch("destination.latitude")}
                        onChange={(e) =>
                          setValue(
                            "destination.latitude",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Dest. Longitude
                      </span>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0.0000"
                        className="h-8 text-xs"
                        value={watch("destination.longitude")}
                        onChange={(e) =>
                          setValue(
                            "destination.longitude",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

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
                        // 1. Find the full stop data using the ID
                        const selectedStop = busStops?.bus_stop.data.find(
                          (s) => s._id === id,
                        );

                        if (selectedStop) {
                          const currentStops = watch("number_of_stops") || [];

                          // 2. Build the EntryPoint object with test coordinates
                          const newEntry: EntryPoint = {
                            value: selectedStop.location.value.toLowerCase(),
                            longitude: selectedStop.location.longitude, // Test longitude
                            latitude: selectedStop.location.latitude, // Test latitude
                          };

                          // 3. Check for duplicates using the .value property
                          const isDuplicate = currentStops.some(
                            (stop: EntryPoint) => stop.value === newEntry.value,
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
                              // 4. Update filter to check inside the array of objects
                              !watch("number_of_stops")?.some(
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
                      {watch("number_of_stops")
                        ?.flat()
                        .map((stopValue, key) => (
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
                                const current = watch("number_of_stops").flat();
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
                    defaultValue={"Nigeria"}
                    placeholder="Enter country"
                  />
                </div>
                <Button
                  disabled={modifyTripRoute.isPending || holdBtn}
                  onClick={handleModifyRoute}
                  className={`w-full bg-primary ${
                    modifyTripRoute.isPending || holdBtn ? "opacity-30" : ""
                  } hover:bg-primary/90 text-primary-foreground`}
                >
                  {modifyTripRoute.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Update Route</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                value={`₦${selRoute.rate}`}
                icon={<RadioTower />}
              />
              <InfoItem
                label="Flat Rate"
                value={`₦${selRoute.flat_rate}`}
                icon={<Tag />}
              />
              <InfoItem
                label="Rate Per KM"
                value={`₦${selRoute.rate_per_km}`}
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
                    ? selRoute.number_of_stops.length // .flat() is no longer needed if it's a standard array
                    : 0
                }`}
                value={`${
                  Array.isArray(selRoute?.number_of_stops)
                    ? selRoute.number_of_stops
                        .map((stop: EntryPoint) => stop.value)
                        .join(", ")
                    : "No stops"
                }`}
                icon={<Flag />}
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
        </div>
      )}
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
  value: string;
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
        <p className="text-sm capitalize font-semibold">{value}</p>
      </div>
    </div>
  );
}
