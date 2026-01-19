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
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { AddBusStopPayload, AddPickupStationPayload } from "@/types";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useDeleteDropOffStation,
  useModifyDropOffStation,
} from "@/api/drop-off-locations";
import { useDeleteBusStop, useModifyBusStop } from "@/api/bus-stops";

interface StationDetailProps {
  onBack: () => void;
}

export function BusStopDetail({ onBack }: StationDetailProps) {
  const { selBusStop } = useSelector((state: RootState) => state.busStops);
  const isActive = selBusStop?.status === "active";

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [holdPickupBtn, setHoldPickupBtn] = useState(true);

  const deleteMutation = useDeleteBusStop();

  const router = useRouter();

  const handleDeleteBusStop = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSettled: () => router.push("/app-menu/bus-stops"),
    });
  };

  const { register, setValue, watch } = useForm<AddBusStopPayload>({
    defaultValues: {
      routes: selBusStop?.routes,
      location: selBusStop?.location,
      area: selBusStop?.area,
      state: selBusStop?.state,
      country: selBusStop?.country,
    },
  });

  const selectedState = watch("state");

  const modifyBusStopMutation = useModifyBusStop();

  const handleWatch = watch();
  const { routes, location, area, state, country } = handleWatch;

  const handleMopdifyBusStop = () => {
    if (!selBusStop) return;
    modifyBusStopMutation.mutate(
      {
        bus_stop_id: selBusStop._id,
        location,
        routes,
        area,
        state,
        country,
      },
      {
        onSettled: () => setIsAddDialogOpen(false),
      }
    );
  };

  useEffect(() => {
    if (routes && location && area && state && country) {
      setHoldPickupBtn(false);
    } else {
      setHoldPickupBtn(true);
    }
  }, [routes, location, area, state, country]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Bus Stops Table
        </Button>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" /> Edit Bus-Stop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Bus-Stop</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="routes">Enter Routes</Label>
                  <Input
                    id="routes"
                    {...register("routes")}
                    placeholder="Enter routes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Enter Location</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Enter Location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Enter Area</Label>
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
                  disabled={modifyBusStopMutation.isPending || holdPickupBtn}
                  onClick={handleMopdifyBusStop}
                  className={`w-full bg-primary ${
                    modifyBusStopMutation.isPending || holdPickupBtn
                      ? "opacity-30"
                      : ""
                  } hover:bg-primary/90 text-primary-foreground`}
                >
                  {modifyBusStopMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Update Bus-Stop</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Permanently delete this Bus-Stop?"))
                handleDeleteBusStop(selBusStop?._id || "");
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Bus-Stop
          </Button>
        </div>
      </div>

      {selBusStop && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-border">
            <CardContent className="pt-8 text-center">
              <div className="h-20 w-20 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-secondary">
                <MapPin className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold px-4">{selBusStop?.routes}</h2>
              <h2 className="text-xl font-bold px-4">{selBusStop?.location}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {selBusStop?.area}
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
                  {selBusStop.state}, {selBusStop.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />{" "}
                <span>
                  Added by: {selBusStop.added_by.first_name}{" "}
                  {selBusStop.added_by.last_name}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Bus Stop Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="Routes"
                value={`${selBusStop.routes}`}
                icon={<Route />}
              />
              <InfoItem
                label="Address"
                value={selBusStop.location}
                icon={<MapPin />}
              />
              <InfoItem
                label="Area"
                value={selBusStop.area}
                icon={<MapPin />}
              />
              <InfoItem
                label="State"
                value={selBusStop.state}
                icon={<Globe />}
              />
              <InfoItem
                label="Country"
                value={selBusStop.country}
                icon={<Globe />}
              />
              <InfoItem
                label="Date Created"
                value={new Date(selBusStop.createdAt).toDateString()}
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
