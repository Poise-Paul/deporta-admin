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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDeletePickupStation,
  useModifyPickupStation,
} from "@/api/pick-up-stations";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { AddPickupStationPayload } from "@/types";
import { NIGERIA_STATES } from "@/constants/nigeria-states";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface StationDetailProps {
  onBack: () => void;
}

export function PickupStationDetail({ onBack }: StationDetailProps) {
  const { selStation } = useSelector((state: RootState) => state.dropOffStation);
  const isActive = selStation?.status === "active";

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [holdPickupBtn, setHoldPickupBtn] = useState(true);

  const deleteMutation = useDeletePickupStation();

  const router = useRouter();

  const handleDeleteStation = (stationId: string) => {
    deleteMutation.mutate(stationId, {
      onSettled: () => router.push("/app-menu/dropoff-locations"),
    });
  };

  const { register, setValue, watch } = useForm<AddPickupStationPayload>({
    defaultValues: {
      address: selStation?.address,
      area: selStation?.area,
      state: selStation?.state,
      country: selStation?.country,
    },
  });

  const selectedState = watch("state");

  const modifyStationMutation = useModifyPickupStation();

  const handleWatch = watch();
  const { address, area, state, country } = handleWatch;

  const handlePickupStation = () => {
    if (!selStation) return;
    modifyStationMutation.mutate(
      {
        pickup_station_id: selStation._id,
        address,
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
    if (address && area && state && country) {
      setHoldPickupBtn(false);
    } else {
      setHoldPickupBtn(true);
    }
  }, [address, area, state, country]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Drop-Off Locations
        </Button>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" /> Edit Drop Off Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Pickup Station</DialogTitle>
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
                  disabled={modifyStationMutation.isPending || holdPickupBtn}
                  onClick={handlePickupStation}
                  className={`w-full bg-primary ${
                    modifyStationMutation.isPending || holdPickupBtn
                      ? "opacity-30"
                      : ""
                  } hover:bg-primary/90 text-primary-foreground`}
                >
                  {modifyStationMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Update Pickup Station</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Permanently delete this station?"))
                handleDeleteStation(selStation?._id || "");
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Station
          </Button>
        </div>
      </div>

      {selStation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-border">
            <CardContent className="pt-8 text-center">
              <div className="h-20 w-20 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-secondary">
                <MapPin className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold px-4">{selStation?.address}</h2>
              <p className="text-muted-foreground text-sm mb-4">
                {selStation?.area}
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
                  {selStation.state}, {selStation.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />{" "}
                <span>
                  Added by: {selStation.added_by.first_name}{" "}
                  {selStation.added_by.last_name}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Pickup Station Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="Address"
                value={selStation.address}
                icon={<MapPin />}
              />
              <InfoItem
                label="Area"
                value={selStation.area}
                icon={<MapPin />}
              />
              <InfoItem
                label="State"
                value={selStation.state}
                icon={<Globe />}
              />
              <InfoItem
                label="Country"
                value={selStation.country}
                icon={<Globe />}
              />
              <InfoItem
                label="Date Created"
                value={new Date(selStation.createdAt).toDateString()}
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
