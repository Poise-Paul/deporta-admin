"use client";

import React, { useEffect, useState } from "react";
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
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  X,
  Loader2,
  Edit,
  Delete,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { AddBusPayload, Driver, FuelType } from "@/types";
import { DRIVERS } from "@/constants/drivers";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getAllBuses, useCreateBus } from "@/api/buses";
import { useQuery } from "@tanstack/react-query";

type BusTab = "all" | "active" | "maintenance" | "inactive";

const tabs: { id: BusTab; label: string }[] = [
  { id: "all", label: "All Buses" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "maintenance", label: "In Maintenance" },
];

export function BusSystemsTable() {
  const [activeTab, setActiveTab] = useState<BusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [holdBtn, setHoldBtn] = useState(true);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file); // File for upload
      setValue("imageUrl", URL.createObjectURL(file)); // Preview URL for display
    }
  };

  const selectedState = watch("fuel_type");

  const createBusMutation = useCreateBus();

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
  } = handleWatch;

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

  const handleCreateBus = () => {
    createBusMutation.mutate({
      image,
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
    });
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["allBuses"],
    queryFn: () => getAllBuses(),
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { paginatedData, totalPages } = React.useMemo(() => {
    const allBusesData = data?.buses.data || [];

    // 1. Filter by Search Query (Checking multiple fields)
    let filtered = allBusesData.filter((bus) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        bus.name_label?.toLowerCase().includes(searchStr) ||
        bus.id_code?.toLowerCase().includes(searchStr) ||
        bus.plate_number?.toLowerCase().includes(searchStr)
      );
    });

    // 2. Filter by Tab Status
    if (activeTab === "active") {
      filtered = filtered.filter((s) => s.status);
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((s) => !s.status);
    } else if (activeTab === "maintenance") {
      filtered = filtered.filter((s) => s.status);
    }

    // 3. Calculate Total Pages based on the filtered/searched list
    const total = Math.ceil(filtered.length / itemsPerPage) || 1;

    // 4. Slice the data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedData: slicedData, totalPages: total };
  }, [data, activeTab, currentPage, itemsPerPage, searchQuery]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                  <Plus className="h-4 w-4" />
                  Add New Bus
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Bus System</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Bus Image</Label>{" "}
                    <div className="w-20 h-20 mt-2 rounded-lg overflow-hidden border">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          className="object-cover h-20 w-20"
                          src={imageUrl || "/shuttle-bus.png"}
                          alt="profile_img"
                        />
                        <AvatarFallback className="">Bus Image</AvatarFallback>
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add a driver..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DRIVERS.filter(
                            (d) => !watch("drivers_assigned").includes(d._id)
                          ).map((driver) => (
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
                    disabled={createBusMutation.isPending || holdBtn}
                    onClick={handleCreateBus}
                    className={`w-full bg-primary ${
                      createBusMutation.isPending || holdBtn ? "opacity-30" : ""
                    } hover:bg-primary/90 text-primary-foreground`}
                  >
                    {createBusMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Create New Bus</>
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
              {paginatedData.map((bus) => (
                <tr
                  key={bus._id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <img
                      src={bus.bus_photo || "/placeholder.svg"}
                      alt={bus.name_label}
                      className="w-16 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-sm text-secondary">
                    {bus.id_code}
                  </td>
                  <td className="p-4 text-sm">{bus.name_label}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.routes_assigned?.length > 0
                      ? bus.drivers_assigned.join("-")
                      : "No routes assigned"}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.capacity}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {bus.drivers_assigned?.length > 0
                      ? bus.drivers_assigned.join(", ")
                      : "No drivers assigned"}
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
                          <Link href={`/app-menu/buses/${bus._id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Delete className="text-red-700" />
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
                      : "text-muted-foreground"
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
    </Card>
  );
}
