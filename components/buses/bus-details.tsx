"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getStaffList } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddBusPayload,
  EditBusPayload,
  FuelType,
  RouteData,
  StaffData,
} from "@/types";
import { useModifyBuses } from "@/api/buses";
import { getRoutes } from "@/api/routes";
import { Toaster } from "react-hot-toast";

interface BusDetailsProps {
  busId: string;
}

export function BusDetails({ busId }: BusDetailsProps) {
  const { selBus } = useSelector((state: RootState) => state.bus);

  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const [holdBtn, setHoldBtn] = useState(true);
  const { data: staffData, refetch: refetchStaffs } = useQuery({
    queryKey: ["staffs"],
    retry: false,
    queryFn: () => getStaffList(),
  });

  const { register, setValue, watch, reset } = useForm<EditBusPayload>({
    defaultValues: {
      imageUrl: selBus?.bus_photo,
      bus_id: selBus?._id,
      id_code: selBus?.id_code,
      name_label: selBus?.name_label,
      routes_assigned: selBus?.routes_assigned,
      drivers_assigned: selBus?.drivers_assigned,
      plate_number: selBus?.plate_number,
      capacity: selBus?.capacity,
      operation_schedule: {
        from: selBus?.operation_schedule.from,
        to: selBus?.operation_schedule.to,
      },
      status: selBus?.status ? true : false,
      fuel_type: selBus?.fuel_type as FuelType,
      tracker_id: selBus?.tracker_id,
      mileage: selBus?.mileage,
    },
  });

  const modifyBusMutation = useModifyBuses();

  const {
    data: tripRoutes,
    refetch: refetchRoutes,
    isLoading: tripLoader,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });
  const handleWatch = watch();
  const {
    image,
    id_code,
    name_label,
    imageUrl,
    routes_assigned,
    drivers_assigned,
    plate_number,
    capacity,
    operation_schedule,
    status,
    fuel_type,
    tracker_id,
    mileage,
    bus_id,
  } = handleWatch;

  const handleModifyBus = () => {
    modifyBusMutation.mutate(
      {
        image,
        id_code,
        bus_id: busId,
        routes_assigned,
        drivers_assigned,
        name_label,
        plate_number,
        capacity: Number(capacity),
        operation_schedule,
        status,
        fuel_type,
        tracker_id,
        mileage,
      },
      {
        onSettled: () => setIsDialogueOpen(false),
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file); // File for upload
      setValue("imageUrl", URL.createObjectURL(file)); // Preview URL for display
    }
  };

  const selectedState = watch("fuel_type");

  useEffect(() => {
    if (
      id_code &&
      imageUrl &&
      id_code &&
      name_label &&
      routes_assigned &&
      drivers_assigned &&
      plate_number &&
      capacity &&
      operation_schedule &&
      status &&
      fuel_type &&
      tracker_id &&
      mileage
    ) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [
    id_code,
    imageUrl,
    id_code,
    name_label,
    routes_assigned,
    drivers_assigned,
    plate_number,
    capacity,
    operation_schedule,
    status,
    fuel_type,
    tracker_id,
    mileage,
  ]);

  // In a real app, this would fetch bus data based on busId
  const bus = {
    id: busId,
    name: "Island Runner",
    dateAssigned: "05/05/2025",
    status: "Active",
    route: "AJUB - OSBR",
    capacity: 20,
    driver: {
      name: "Jejelola Rotimi",
      avatar: "/african-driver-man.jpg",
    },
    scheduledMaintenance: "14/12/2025 (Tuesday)",
    images: [
      "/transport-bus-black.jpg",
      "/passenger-bus.jpg",
      "/shuttle-bus.png",
      "/transport-bus-black.jpg",
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Section - Bus Info */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Bus Image */}
            <div className="shrink-0">
              <img
                src={selBus?.bus_photo}
                alt={selBus?.name_label}
                className="w-full md:w-64 h-40 rounded-lg object-cover"
              />
            </div>

            {/* Driver Info */}
            {selBus && (
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex -space-x-2">
                  {selBus.drivers_assigned?.length > 0
                    ? selBus.drivers_assigned.map((routeId, key) => {
                        const driver = staffData?.staffs.data.find(
                          (r) =>
                            r.user_type.type_id.role === "driver" &&
                            r._id === routeId
                        );
                        return (
                          <Avatar
                            key={key}
                            className="h-12 w-12 border-2 border-card"
                          >
                            <AvatarImage src={driver?.profile_image} />
                            <AvatarFallback>{`U${key}`}</AvatarFallback>
                          </Avatar>
                        );
                      })
                    : null}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">
                    Driver Assigned
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {selBus.drivers_assigned?.length > 0
                      ? selBus.drivers_assigned.map((routeId) => {
                          const driver = staffData?.staffs.data.find(
                            (r) =>
                              r.user_type.type_id.role === "driver" &&
                              r._id === routeId
                          );
                          return (
                            <Badge
                              key={routeId}
                              variant="outline"
                              className="text-[10px] px-1"
                            >
                              {driver
                                ? `${driver.first_name} ${driver.last_name}`
                                : routeId}
                            </Badge>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            )}

            {/* Update Button */}
            <div className="md:ml-auto">
              <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Plus className="h-4 w-4" />
                    Update Bus
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Bus System</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Bus Image</Label>{" "}
                      <div className="w-20 h-20 mt-2 rounded-lg overflow-hidden border">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            className="object-cover h-20 w-20"
                            src={
                              imageUrl ||
                              "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                            }
                            alt="profile_img"
                          />
                          <AvatarFallback className="">
                            Bus Image
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Input
                        type="file"
                        className="mt-2"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Enter BUS CODE</Label>
                        <Input
                          id="name"
                          {...register("id_code")}
                          placeholder="Enter BUS CODE"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Name Label</Label>
                        <Input
                          id="area"
                          {...register("name_label")}
                          placeholder="Enter area"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Assign Routes
                        </label>
                        <Select
                          onValueChange={(value) => {
                            const current = watch("routes_assigned") || [];
                            if (!current.includes(value)) {
                              setValue("routes_assigned", [...current, value]);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Add a route..." />
                          </SelectTrigger>
                          <SelectContent>
                            {tripRoutes?.trip_route.data
                              .filter(
                                (d) => !watch("routes_assigned").includes(d._id)
                              ) // Hide already selected
                              .map((route) => (
                                <SelectItem key={route._id} value={route._id}>
                                  {route.code}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {/* Selected Drivers */}

                        <div className="flex flex-wrap gap-2">
                          {watch("routes_assigned")
                            .filter((id) => id !== "")
                            .map((driverId) => {
                              const route = tripRoutes?.trip_route.data.find(
                                (d: RouteData) => d._id === driverId
                              );
                              return (
                                <Badge
                                  key={driverId}
                                  variant="secondary"
                                  className="pl-2 pr-1 py-1"
                                >
                                  {route?.code}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = watch("routes_assigned");
                                      setValue(
                                        "routes_assigned",
                                        current.filter((id) => id !== driverId)
                                      );
                                    }}
                                    className="ml-2 hover:bg-destructive hover:text-white rounded-full p-0.5"
                                  >
                                    <X size={12} />
                                  </button>
                                </Badge>
                              );
                            })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Assign Drivers
                        </label>
                        <Select
                          onValueChange={(value) => {
                            const current = watch("drivers_assigned") || [];
                            if (!current.includes(value)) {
                              setValue("drivers_assigned", [...current, value]);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Add a driver..." />
                          </SelectTrigger>
                          <SelectContent>
                            {staffData?.staffs.data
                              .filter(
                                (d) =>
                                  d.user_type.type_id.role === "driver" &&
                                  !watch("drivers_assigned").includes(d._id)
                              )
                              .map((driver) => (
                                <SelectItem key={driver._id} value={driver._id}>
                                  {driver.first_name} {driver.last_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {/* Selected Drivers */}

                        <div className="flex flex-wrap gap-2">
                          {watch("drivers_assigned")
                            .filter((id) => id !== "")
                            .map((driverId) => {
                              const driver = staffData?.staffs.data.find(
                                (d: StaffData) => d._id === driverId
                              );
                              return (
                                <Badge
                                  key={driverId}
                                  variant="secondary"
                                  className="pl-2 pr-1 py-1"
                                >
                                  {driver?.first_name} {driver?.last_name}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = watch("drivers_assigned");
                                      setValue(
                                        "drivers_assigned",
                                        current.filter((id) => id !== driverId)
                                      );
                                    }}
                                    className="ml-2 hover:bg-destructive hover:text-white rounded-full p-0.5"
                                  >
                                    <X size={12} />
                                  </button>
                                </Badge>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="area">Plate Number</Label>
                        <Input
                          id="plate_number"
                          {...register("plate_number")}
                          placeholder="Enter Plate Number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          {...register("capacity")}
                          placeholder="Enter Capacity"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schedule_from">
                          Operation Schedule From
                        </Label>
                        <Input
                          id="schedule_from"
                          type="datetime-local"
                          {...register("operation_schedule.from")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schedule_to">
                          Operation Schedule To
                        </Label>
                        <Input
                          id="schedule_to"
                          type="datetime-local"
                          {...register("operation_schedule.to")}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">Status</Label>
                        <RadioGroup
                          defaultValue="true"
                          onValueChange={(val) =>
                            setValue("status", val === "true")
                          }
                          className="flex gap-4 mt-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="r1" />
                            <Label htmlFor="r1">Active</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="r2" />
                            <Label htmlFor="r2">Inactive</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fuel Type</label>
                        <Select
                          value={selectedState}
                          onValueChange={(value) =>
                            setValue("fuel_type", value as FuelType)
                          }
                        >
                          <SelectTrigger className="w-full bg-transparent border-border">
                            <SelectValue placeholder="Select a State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={"1"} value={"petrol"}>
                              Petrol
                            </SelectItem>
                            <SelectItem key={"2"} value={"diesel"}>
                              Diesel
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Tracker ID</Label>
                        <Input
                          id="tracker_id"
                          {...register("tracker_id")}
                          placeholder="Tracker ID"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">Mileage</Label>
                        <Input
                          id="mileage"
                          {...register("mileage")}
                          placeholder="Enter Bus Mileage"
                        />
                      </div>
                    </div>

                    <Button
                      disabled={modifyBusMutation.isPending || holdBtn}
                      onClick={handleModifyBus}
                      className={`w-full bg-primary ${
                        modifyBusMutation.isPending || holdBtn
                          ? "opacity-30"
                          : ""
                      } hover:bg-primary/90 text-primary-foreground`}
                    >
                      {modifyBusMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>Save Changes</>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Bus Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-muted-foreground">Bus ID/ Code</p>
              <p className="font-semibold text-sm">{selBus?.id_code}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bus Name</p>
              <p className="font-semibold text-sm">{selBus?.name_label}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date Created</p>
              {selBus && (
                <p className="font-semibold text-sm">
                  {new Date(selBus?.createdAt).toDateString()}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className="border-green-500 text-green-600 bg-green-50 font-normal"
              >
                {selBus?.status}
              </Badge>
            </div>
            {selBus && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Route(s) Assigned
                </p>
                <div className="flex flex-wrap gap-1">
                  {selBus?.routes_assigned?.length > 0
                    ? selBus?.routes_assigned.map((routeId) => {
                        const route = tripRoutes?.trip_route.data.find(
                          (r) => r._id === routeId
                        );
                        return (
                          <Badge
                            key={routeId}
                            variant="outline"
                            className="text-[10px] px-1"
                          >
                            {route ? route.code : routeId}
                          </Badge>
                        );
                      })
                    : "No routes"}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-semibold text-sm">{selBus?.capacity}</p>
            </div>
            {selBus && (
              <div>
                <p className="text-xs text-muted-foreground">Driver Assigned</p>
                {selBus.drivers_assigned?.length > 0
                  ? selBus.drivers_assigned.map((routeId) => {
                      const driver = staffData?.staffs.data.find(
                        (r) =>
                          r.user_type.type_id.role === "driver" &&
                          r._id === routeId
                      );
                      return (
                        <Badge
                          key={routeId}
                          variant="outline"
                          className="text-[10px] px-1"
                        >
                          {driver
                            ? `${driver.first_name} ${driver.last_name}`
                            : routeId}
                        </Badge>
                      );
                    })
                  : "No Drivers Assigned"}
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">
                Scheduled Maintenance
              </p>
              <p className="font-semibold text-sm">
                {bus.scheduledMaintenance}
              </p>
            </div>
          </div>

          {/* Car Images */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Car Images{" "}
              <span className="text-xs">
                (click car images to open them bigger)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {bus.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Bus image ${index + 1}`}
                  className="w-full h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Section - Map */}
      <Card className="bg-card border border-border">
        <CardContent className="p-0 h-full min-h-[400px]">
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <img
              src="/lagos-map-with-route-markers-and-bus-stops.jpg"
              alt="Route Map"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
