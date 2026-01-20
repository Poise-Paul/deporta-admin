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
import { AddPickupStationPayload, AddTripRoute } from "@/types";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteRoute, useModifyRoutes } from "@/api/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllBusStops } from "@/api/bus-stops";

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
      destination: `${selRoute?.destination}`,
      starting_point: `${selRoute?.starting_point}`,
      route_distance: `${selRoute?.route_distance}`,
      number_of_stops: Array.isArray(selRoute?.number_of_stops)
        ? selRoute.number_of_stops.flat()
        : [],
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
      },
      {
        onSettled: () => setIsAddDialogOpen(false),
      }
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
                    <Label htmlFor="name">Rate</Label>
                    <Input
                      id="name"
                      {...register("rate")}
                      placeholder="Enter rate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flat_rate">Flat Rate</Label>
                    <Input
                      id="flat_rate"
                      {...register("flat_rate")}
                      placeholder="Enter Flat Rate"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate_per_km">Rate Per KM</Label>
                    <Input
                      id="rate_per_km"
                      {...register("rate_per_km")}
                      placeholder="Enter Rate Per Km"
                    />
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

                <div className="space-y-2">
                  <Label htmlFor="starting_point">Starting Point</Label>
                  <Input
                    id="starting_point"
                    {...register("starting_point")}
                    placeholder="Enter Starting Point"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    {...register("destination")}
                    placeholder="Enter Destination"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="route_distance">Route Distance</Label>
                  <Input
                    id="route_distance"
                    {...register("route_distance")}
                    placeholder="Enter Route Distance"
                  />
                </div>
                {busStops && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Bus-Stops Along this Route
                    </label>
                    <Select
                      // Value is reset to empty string so the placeholder remains visible
                      value=""
                      onValueChange={(value) => {
                        const currentStops = watch("number_of_stops") || [];
                        // Only add if it's not already in the array
                        if (!currentStops.includes(value)) {
                          setValue("number_of_stops", [...currentStops, value]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-transparent border-border">
                        <SelectValue placeholder="Add bus-stops..." />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Filter BUSTOPS to hide ones already selected */}
                        {busStops?.bus_stop.data
                          .filter(
                            (stop) =>
                              !watch("number_of_stops").includes(
                                stop.location.toLowerCase()
                              )
                          )
                          .map((stop) => (
                            <SelectItem
                              key={stop._id}
                              value={stop.location.toLowerCase()}
                            >
                              {stop.location}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {/* 2. Display Selected Bus-Stops as Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {watch("number_of_stops")
                        ?.flat()
                        .map((stopValue) => (
                          <Badge
                            key={stopValue}
                            variant="secondary"
                            className="flex items-center gap-1 pl-2 pr-1 py-1"
                          >
                            <span className="capitalize">{stopValue}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = watch("number_of_stops").flat();
                                setValue(
                                  "number_of_stops",
                                  current.filter((s) => s !== stopValue)
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
                {selRoute?.starting_point}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {selRoute?.destination}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  isActive
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-orange-500 text-orange-600 bg-orange-50"
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
                value={`${selRoute.rate}`}
                icon={<RadioTower />}
              />
              <InfoItem
                label="Flat Rate"
                value={`${selRoute.flat_rate}`}
                icon={<Tag />}
              />
              <InfoItem
                label="Rate Per KM"
                value={`${selRoute.rate_per_km}`}
                icon={<Route />}
              />
              <InfoItem
                label="Code"
                value={`${selRoute.code}`}
                icon={<Code />}
              />
              <InfoItem
                label="Starting Point"
                value={`${selRoute.starting_point}`}
                icon={<Pin />}
              />
              <InfoItem
                label="Destination"
                value={`${selRoute.destination}`}
                icon={<Flag />}
              />
              <InfoItem
                label="Route Distance"
                value={`${selRoute.route_distance}`}
                icon={<Flag />}
              />
              <InfoItem
                label={`Number Of Stops: ${
                  Array.isArray(selRoute?.number_of_stops)
                    ? selRoute.number_of_stops.flat().length
                    : []
                }`}
                value={`${
                  Array.isArray(selRoute?.number_of_stops)
                    ? selRoute.number_of_stops.flat().join(", ")
                    : []
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
