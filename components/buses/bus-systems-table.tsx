"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus, MoreVertical, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { AddBusPayload, Driver, FuelType } from "@/types";
import { DRIVERS } from "@/constants/drivers";
import { RadioGroup } from "@radix-ui/react-dropdown-menu";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type BusTab = "all" | "active" | "maintenance";

const tabs: { id: BusTab; label: string }[] = [
  { id: "all", label: "All Buses" },
  { id: "active", label: "Active" },
  { id: "maintenance", label: "In Maintenance" },
];

const buses = [
  {
    id: "DEP-02-AJAH",
    name: "Island Runner",
    route: "AJUB - OSBR",
    capacity: 20,
    driver: "Jejelola Rotimi",
    status: "active" as const,
    image: "/transport-bus-black.jpg",
  },
  {
    id: "DEP-04-OSHODI",
    name: "City Express",
    route: "OSH - LKI",
    capacity: 18,
    driver: "David Kolawole",
    status: "active" as const,
    image: "/passenger-bus.jpg",
  },
  {
    id: "DEP-05-FESTAC",
    name: "Festac Shuttle",
    route: "FST - CMS",
    capacity: 22,
    driver: "Adewale Qoyum",
    status: "maintenance" as const,
    image: "/shuttle-bus.png",
  },
  {
    id: "DEP-06-IKORODU",
    name: "Ikorodu Link",
    route: "IKD - OWO",
    capacity: 25,
    driver: "Fred Denis",
    status: "active" as const,
    image: "/transport-bus-black.jpg",
  },
];

export function BusSystemsTable() {
  const [activeTab, setActiveTab] = useState<BusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const filteredBuses = buses.filter((bus) => {
    if (activeTab === "active") return bus.status === "active";
    if (activeTab === "maintenance") return bus.status === "maintenance";
    return true;
  });

  const { register, setValue, watch, reset } = useForm<AddBusPayload>({
    values: {
      imageUrl: "",
      id_code: "",
      name_label: "",
      routes_assigned: [""],
      drivers_assigned: [""],
      plate_number: "",
      capacity: "",
      operation_schedule: "",
      status: true,
      fuel_type: FuelType.Petrol,
      tracker_id: "",
      mileage: "",
    },
  });

  const handleWatch = watch();

  const { imageUrl } = handleWatch;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file); // File for upload
      setValue("imageUrl", URL.createObjectURL(file)); // Preview URL for display
    }
  };

  const selectedState = watch("fuel_type");

  const crearteBusMutation = useCreateBus()

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}

          <div>
            <Label>Bus Image</Label>'{" "}
            <div className="w-20 h-20 rounded-lg overflow-hidden border">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  className="object-cover"
                  src={imageUrl}
                  alt="profile_img"
                />
                <AvatarFallback>Bus</AvatarFallback>
              </Avatar>
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Bus by ID or Name"
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
                  {tab.label}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>

            <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bus
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Bus System</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Enter BUS CODE</Label>
                    <Input
                      id="name"
                      {...register("id_code")}
                      placeholder="Enter BUS CODE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      {...register("name_label")}
                      placeholder="Enter area"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign Routes</label>
                    <Select
                      onValueChange={(value) => {
                        const current = watch("routes_assigned") || [];
                        if (!current.includes(value)) {
                          setValue("routes_assigned", [...current, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add a driver..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVERS.filter(
                          (d) => !watch("routes_assigned").includes(d._id)
                        ) // Hide already selected
                          .map((driver) => (
                            <SelectItem key={driver._id} value={driver._id}>
                              {driver.first_name} {driver.last_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {/* Selected Drivers */}

                    <div className="flex flex-wrap gap-2">
                      {watch("routes_assigned")
                        .filter((id) => id !== "")
                        .map((driverId) => {
                          const driver = DRIVERS.find(
                            (d: Driver) => d._id === driverId
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
                      <SelectTrigger>
                        <SelectValue placeholder="Add a driver..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVERS.filter(
                          (d) => !watch("drivers_assigned").includes(d._id)
                        ) // Hide already selected
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
                          const driver = DRIVERS.find(
                            (d: Driver) => d._id === driverId
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
                  <div className="space-y-2">
                    <Label htmlFor="state">Operation Schedule</Label>
                    <Input
                      id="operation_schedule"
                      type="time"
                      {...register("operation_schedule")}
                      placeholder="Operation Schedule"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Status</Label>
                    <RadioGroup
                      defaultValue="true"
                      onValueChange={(val) =>
                        setValue("status", val === "true")
                      }
                      className="flex gap-4"
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fuel Type</label>
                    <Select
                      value={selectedState}
                      onValueChange={(value) => setValue("fuel_type", value as FuelType)}
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
                      type="time"
                      {...register("tracker_id")}
                      defaultValue={"Nigeria"}
                      placeholder="Tracker ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Mileage</Label>
                    <Input
                      id="mileage"
                      type="time"
                      {...register("mileage")}
                      placeholder="Mileage"
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
                      <>Create Bus</>
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
          <CardTitle className="text-base font-semibold">All Buses</CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus Image
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus ID / Code
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Route
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Capacity
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Driver
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr
                  key={bus.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <img
                      src={bus.image || "/placeholder.svg"}
                      alt={bus.name}
                      className="w-16 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-sm text-secondary">
                    {bus.id}
                  </td>
                  <td className="p-4 text-sm">{bus.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.route}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.capacity}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.driver}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        bus.status === "active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-yellow-500 text-yellow-600 bg-yellow-50"
                      )}
                    >
                      {bus.status === "active" ? "Active" : "In Maintenance"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app-menu/buses/${bus.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </Card>
  );
}
