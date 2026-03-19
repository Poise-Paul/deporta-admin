"use client";

import React, { useEffect, useState } from "react";
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
  DropdownMenuSeparator,
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
  UserX,
  UserCheck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { AddBusPayload, FuelType, RouteData, StaffData } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  BusStatusType,
  getAllBuses,
  MaintainancePayload,
  useBusMaintenanceStatus,
  useBusStatus,
  useCreateBus,
  useCreateReport,
  useDeleteBus,
  useModifyBuses,
} from "@/api/buses";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { getRoutes } from "@/api/routes";
import { getStaffList } from "@/api/user";
import { Toaster } from "react-hot-toast";
import { updateSelBus } from "@/lib/store/slices/bus-slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Textarea } from "../ui/textarea";

type BusTab = "all" | "active" | "maintenance" | "inactive";

const tabs: { id: BusTab; label: string }[] = [
  { id: "all", label: "All Buses" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
  { id: "maintenance", label: "Under Maintenance" },
];

export function BusSystemsTable() {
  const [activeTab, setActiveTab] = useState<BusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [holdBtn, setHoldBtn] = useState(true);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [busId, setBusId] = useState("");
  const [deleteBusPhotos, setDeleteBusPhotos] = useState<string[]>([]);

  const { register, setValue, watch, reset } = useForm<AddBusPayload>({
    values: {
      imageUrl: "",
      bus_id: "",
      id_code: "",
      name_label: "",
      routes_assigned: [],
      drivers_assigned: [],
      plate_number: "",
      capacity: "",
      operation_schedule: {
        from: "",
        to: "",
      },
      status: true,
      fuel_type: FuelType.Petrol,
      tracker_id: "",
      mileage: "",
    },
  });

  const handleWatch = watch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);

      // 1. Get existing files/urls from form state to append to them
      const existingFiles = watch("image") || [];
      const existingUrls = watch("imageUrl") || [];

      // 2. Create new preview URLs
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));

      // 3. Update State (Appending new to old)
      setValue("image", [...existingFiles, ...newFiles]);
      setValue("imageUrl", [
        ...(Array.isArray(existingUrls) ? existingUrls : [existingUrls]),
        ...newUrls,
      ]);
    }
  };

  const selectedState = watch("fuel_type");

  const createBusMutation = useCreateBus();
  const modifyBusMutation = useModifyBuses();

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
    delete_bus_photo,
    bus_id,
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
    createBusMutation.mutate(
      {
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
      },
      {
        onSuccess: () => {
          reset();
          refetch();
        },
        onSettled: () => setIsDialogueOpen(false),
      },
    );
  };

  const handleModifyBus = () => {
    modifyBusMutation.mutate(
      {
        image,
        id_code,
        delete_bus_photo,
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
        onSuccess: () => refetch(),
        onSettled: () => setIsDialogueOpen(false),
      },
    );
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["allBuses"],
    queryFn: () => getAllBuses(),
  });

  const {
    data: tripRoutes,
    refetch: refetchRoutes,
    isLoading: tripLoader,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutes(),
  });

  // get the current user
  const { data: staffData, refetch: refetchStaffs } = useQuery({
    queryKey: ["staffs"],
    retry: false,
    queryFn: () => getStaffList(),
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const [roleFilter, setRoleFilter] = useState<string>("all");

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
      filtered = filtered.filter((s) => s.is_maintenance);
    }

    // Role Logic
    if (roleFilter !== "all") {
      filtered = filtered.filter((s) => {
        // 1. Handle Verification Filters
        if (roleFilter === "outsourcing") return s.outsourcing;
      });
    }

    // 3. Calculate Total Pages based on the filtered/searched list
    const total = Math.ceil(filtered.length / itemsPerPage) || 1;

    // 4. Slice the data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginatedData: slicedData, totalPages: total };
  }, [data, activeTab, currentPage, itemsPerPage, searchQuery, roleFilter]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const deleteBusMitation = useDeleteBus();
  const maintainBusMutation = useBusMaintenanceStatus();

  const handleDelBus = (busId: string) => {
    deleteBusMitation.mutate(busId, {
      onSuccess: () => refetch(),
    });
  };

  const handleMaintenance = (data: MaintainancePayload) => {
    maintainBusMutation.mutate(data, {
      onSuccess: () => refetch(),
    });
  };

  // Table Loader
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
  const router = useRouter();
  const dispatch = useDispatch();

  const updateMutation = useBusStatus();

  const handleBusStatus = (data: BusStatusType) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        refetch();
      },
    });
  };

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
                  {tab.label}
                </Button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "bg-transparent",
                    roleFilter !== "all" && "border-primary text-primary",
                  )}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                  All Buses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRoleFilter("outsourcing")}>
                  Outsouring Buses
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    reset();
                    setEditMode(false);
                  }}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Add New Bus
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? " Edit" : "Add"} Bus System
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* <div>
                    <Label>
                      Bus Image <span className="text-destructive">*</span>
                    </Label>
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
                        <AvatarFallback className="">Bus Image</AvatarFallback>
                      </Avatar>
                    </div>
                    <Input
                      type="file"
                      className="mt-2"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div> */}
                  {/* Add New Bus Images */}
                  <div className="space-y-3">
                    <Label>Bus Images (Multiple)</Label>

                    <div className="flex flex-wrap gap-3 mt-2">
                      {Array.isArray(imageUrl) &&
                        imageUrl.map((url, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded-lg border overflow-hidden group"
                          >
                            <img
                              src={url}
                              className="object-cover w-full h-full"
                              alt={`bus-preview-${index}`}
                            />
                            {/* Remove button to clear specific image */}
                            <button
                              type="button"
                              onClick={() => {
                                // 1. Get the URL of the image being removed
                                const urlToDelete = imageUrl[index];
                                const existingDeletes =
                                  watch("delete_bus_photo") || [];

                                // 🔑 THE FIX: Only add to delete list if it's NOT a new local blob
                                // This assumes your server images start with 'http' or a specific domain
                                const isExistingServerImage =
                                  !urlToDelete.startsWith("blob:");

                                if (isExistingServerImage) {
                                  setValue("delete_bus_photo", [
                                    ...existingDeletes,
                                    urlToDelete,
                                  ]);
                                }

                                // 2. Update the UI previews
                                const updatedUrls = imageUrl.filter(
                                  (_, i) => i !== index,
                                );
                                setValue("imageUrl", updatedUrls);

                                // 3. Update the actual File objects being sent for the 'Add' part of the logic
                                // We need to find the correct index in the 'image' file array
                                // New images are usually added to the end of the 'image' array
                                const currentFiles = watch("image") || [];

                                // If it was a blob, it means it's in our 'image' files array and needs to be removed from there
                                if (!isExistingServerImage) {
                                  // Find which index this blob corresponds to in your file array
                                  // (This logic assumes you keep your files and blob URLs in sync)
                                  const updatedFiles = currentFiles.filter(
                                    (_, i) =>
                                      i !==
                                      index -
                                        (imageUrl.length - currentFiles.length),
                                  );
                                  setValue("image", updatedFiles);
                                }
                              }}
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                      {/* The "Add More" box if no images yet or to keep the input visible */}
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* End Bus Images */}

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Enter BUS CODE
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        {...register("id_code")}
                        placeholder="Enter BUS CODE"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">
                        Name Label <span className="text-destructive">*</span>
                      </Label>
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
                        Assign Routes{" "}
                        <span className="text-destructive">*</span>
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
                              (d) => !watch("routes_assigned").includes(d._id),
                            )
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
                              (d: RouteData) => d._id === driverId,
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
                                      current.filter((id) => id !== driverId),
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
                        Assign Drivers{" "}
                        <span className="text-destructive">*</span>
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
                                !watch("drivers_assigned").includes(d._id),
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
                              (d: StaffData) => d._id === driverId,
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
                                      current.filter((id) => id !== driverId),
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
                      <Label htmlFor="area">
                        Plate Number<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="plate_number"
                        {...register("plate_number")}
                        placeholder="Enter Plate Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">
                        Capacity<span className="text-destructive">*</span>
                      </Label>
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
                        <span className="text-destructive">*</span>
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
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="schedule_to"
                        type="datetime-local"
                        {...register("operation_schedule.to")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Fuel Type<span className="text-destructive">*</span>
                      </label>
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
                      <Label htmlFor="state">
                        Tracker ID<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="tracker_id"
                        {...register("tracker_id")}
                        placeholder="Tracker ID"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">
                        Mileage<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="mileage"
                        {...register("mileage")}
                        placeholder="Enter Bus Mileage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">
                        Status<span className="text-destructive">*</span>
                      </Label>
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

                  {editMode ? (
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
                  ) : (
                    <Button
                      disabled={createBusMutation.isPending || holdBtn}
                      onClick={handleCreateBus}
                      className={`w-full bg-primary ${
                        createBusMutation.isPending || holdBtn
                          ? "opacity-30"
                          : ""
                      } hover:bg-primary/90 text-primary-foreground`}
                    >
                      {createBusMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>Create New Bus</>
                      )}
                    </Button>
                  )}
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
                  Route(s) Assigned
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Capacity
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Driver(s) Assigned
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Maintenance
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
                paginatedData.map((bus) => (
                  <tr
                    key={bus._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <img
                        src={bus.bus_photos[0] || "/placeholder.svg"}
                        alt={bus.name_label}
                        className="w-16 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="p-4 font-medium text-sm text-secondary">
                      {bus.id_code}
                    </td>
                    <td className="p-4 text-sm">{bus.name_label}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div className="flex flex-wrap gap-1">
                        {bus.routes_assigned?.length > 0
                          ? bus.routes_assigned.map((route) => {
                              return (
                                <Badge
                                  key={route._id}
                                  variant="outline"
                                  className="text-[10px] px-1"
                                >
                                  {route.code}
                                </Badge>
                              );
                            })
                          : "No routes"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {bus.capacity}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div className="flex flex-wrap gap-1">
                        {bus.drivers_assigned?.length > 0
                          ? bus.drivers_assigned.map((driver, key) => {
                              return (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-[10px] px-1"
                                >
                                  {driver.first_name} {driver.last_name}
                                </Badge>
                              );
                            })
                          : "No Drivers Assigned"}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          bus.is_maintenance
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                            : "border-green-500 text-green-600 bg-green-50",
                        )}
                      >
                        {bus.is_maintenance ? "Maintenance" : "Good"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          bus.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-yellow-500 text-yellow-600 bg-yellow-50",
                        )}
                      >
                        {bus.status === "active" ? "Active" : "In Active"}
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
                              dispatch(updateSelBus(bus));
                              router.push(`/app-menu/buses/${bus.id_code}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const fromDate =
                                bus.operation_schedule.from.slice(0, 16);
                              setValue("operation_schedule.from", fromDate);
                              const toDate = bus.operation_schedule.to.slice(
                                0,
                                16,
                              );
                              const driverIds = bus.drivers_assigned.map(
                                (driver) => driver._id,
                              );
                              const routeIds = bus.routes_assigned.map(
                                (route) => route._id,
                              );
                              setValue("routes_assigned", routeIds);
                              setValue("operation_schedule.to", toDate);

                              setBusId(bus._id);
                              setEditMode(true);
                              setValue("imageUrl", bus.bus_photos);
                              setValue("bus_id", bus._id);
                              setValue("id_code", bus.id_code);
                              setValue("name_label", bus.name_label);
                              setValue("routes_assigned", routeIds);
                              setValue("drivers_assigned", driverIds);
                              setValue("plate_number", bus.plate_number);
                              setValue("capacity", `${bus.capacity}`);
                              setValue(
                                "status",
                                bus.status === "active" ? true : false,
                              );
                              setValue("fuel_type", bus.fuel_type as FuelType);
                              setValue("tracker_id", bus.tracker_id);
                              setValue("mileage", bus.mileage);

                              setIsDialogueOpen(true);
                            }}
                          >
                            <Edit className="" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleBusStatus({
                                status:
                                  bus.status === "active"
                                    ? "in-active"
                                    : "active",
                                bus_id: bus._id,
                              });
                            }}
                            className={
                              bus.status === "active"
                                ? "text-destructive"
                                : "text-success"
                            }
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                {bus.status === "active" ? (
                                  <UserX className="mr-2 text-destructive h-4 w-4" />
                                ) : (
                                  <UserCheck className="mr-2 text-success h-4 w-4" />
                                )}
                              </>
                            )}

                            {bus.status === "active"
                              ? "De-activate"
                              : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleMaintenance({
                                is_maintenance: !bus.is_maintenance,
                                bus_id: bus._id,
                              });
                            }}
                            className={` ${bus.is_maintenance ? "text-green-600 focus:text-green-700" : "text-orange-600 focus:text-orange-700"}  cursor-pointer`}
                            disabled={maintainBusMutation.isPending}
                          >
                            {maintainBusMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Wrench className="mr-2 h-4 w-4" />
                            )}

                            {bus.is_maintenance
                              ? "Back to Service"
                              : "Move to Maintenance"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelBus(bus._id);
                            }}
                            className="text-destructive"
                          >
                            {deleteBusMitation.isPending ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <>
                                <Delete className="text-destructive " />
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
