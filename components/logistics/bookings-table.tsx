"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Check,
  Edit2,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getOutsouceBuses, getOutsouceDrivers } from "@/api/outsourcing-driver";
import { Badge } from "../ui/badge";
import { DriverOutsourceType, useOutsourceStatus } from "@/api/driver";
import { queryClient } from "@/api/queryClient";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import { getDriversList } from "@/api/staffs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Driver, DriverData } from "@/types";
import {
  getAllBookings,
  useCreateBooking,
  useDeleteBooking,
  useEditBooking,
} from "@/api/bookings";

type OutsourcingTab = "all" | "paid" | "pending";

const tabs: { id: OutsourcingTab; label: string }[] = [
  { id: "all", label: "All Bookings" },
  { id: "paid", label: "Paid Bookings" },
  { id: "pending", label: "Pending Bookings" },
];

const cooperateUsersList = [
  {
    _id: "corp_1a2b3c4d5e",
    company_name: "TechFlow Solutions",
    first_name: "TechFlow",
    last_name: "Admin",
    email: "admin@techflow.com",
    phone: "+234 801 234 5678",
  },
  {
    _id: "corp_6f7g8h9i0j",
    company_name: "Apex Global Logistics",
    first_name: "Apex",
    last_name: "Global",
    email: "logistics@apexglobal.ng",
    phone: "+234 802 345 6789",
  },
  {
    _id: "corp_1k2l3m4n5o",
    company_name: "", // Testing the fallback to first_name
    first_name: "Sarah",
    last_name: "Jenkins",
    email: "sarah.j@enterprise.com",
    phone: "+234 803 456 7890",
  },
  {
    _id: "corp_6p7q8r9s0t",
    company_name: "Zenith Holdings Ltd",
    first_name: "Zenith",
    last_name: "Holdings",
    email: "contact@zenithholdings.com",
    phone: "+234 804 567 8901",
  },
  {
    _id: "corp_1u2v3w4x5y",
    company_name: "Pinnacle Transport",
    first_name: "Pinnacle",
    last_name: "Admin",
    email: "hello@pinnacle.ng",
    phone: "+234 805 678 9012",
  },
];

export function BookingsTable() {
  const [activeTab, setActiveTab] = useState<OutsourcingTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get All Users

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ougsource details
  const [isDriverOutsourceModalOpen, setIsDriverOutsourceModalOpen] =
    useState(false);
  const [selectedDriverForOutsource, setSelectedDriverForOutsource] = useState<
    string | null
  >(null);
  const [driverOutsourceAmount, setDriverOutsourceAmount] =
    useState<string>("");
  const [addOutsourceAmount, setAddOutsourceAmount] = useState<string>("");
  // End Outsource Details

  const [bookingCurPage, setBookingCurrentPage] = useState(1);
  const [bookingItemsPerPage, setBookingsItemsPerPage] = useState(10);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["bookings", bookingCurPage, bookingItemsPerPage],
    retry: false,
    queryFn: () => getAllBookings(bookingCurPage, bookingItemsPerPage),
  });

  const {
    data: outsourceDrivers,
    isLoading: driverLoader,
    isRefetching: isDriversRefetching,
    refetch: refetchDrivers,
  } = useQuery({
    queryKey: ["outsourceDrivers", currentPage],
    retry: false,
    queryFn: () => getOutsouceDrivers(currentPage, itemsPerPage),
  });

  const {
    data: outsourceBuses,
    isLoading: busLoader,
    isRefetching: isBusesRefetching,
    refetch: refetchBuses,
  } = useQuery({
    queryKey: ["outsourceBuses", currentPage],
    retry: false,
    queryFn: () => getOutsouceBuses(currentPage, itemsPerPage),
  });

  // 🔑 Modal & Form States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [busDropdownOpen, setBusDropdownOpen] = useState(false);
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    cooperate_user_id: "",
    buses_assigned: [] as string[],
    driver_assigned: [] as string[],
    contract_start: "",
    contract_end: "",
  });

  // 🔑 Mutations
  const createBooking = useCreateBooking();
  const editBooking = useEditBooking();
  const deleteBooking = useDeleteBooking();
  // End State Updates

  // Assuming your API returns a structure like the Maintenance one:
  const pagination = data?.booking.pagination;
  const totalPages = pagination?.totalPages || 1;

  const filteredData = useMemo(() => {
    if (!data?.booking?.data) return [];

    return data.booking.data.filter((item) => {
      // 1. Filter by Status Tab
      const matchesStatus =
        activeTab === "all" ||
        (activeTab === "paid" && item.status === "paid") ||
        (activeTab === "pending" &&
          (item.status === "pending" || !item.status));

      // 2. Filter by Search Query
      // We check name, email, or any other relevant field
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !item.added_by || // if added_by is null, always include
        item.added_by?.user_type?.type_id?.company_name
          ?.toLowerCase()
          .includes(searchLower) ||
        item.added_by?.first_name?.toLowerCase().includes(searchLower) ||
        item.added_by?.last_name?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [data, activeTab, searchQuery]);

  const updateOutsourceMutation = useOutsourceStatus();

  const [driverSearch, setDriverSearch] = useState("");
  const [limit, setLimit] = useState(20);

  // Drivers List
  const drivers =
    outsourceDrivers?.staffs.data.filter(
      (driver) => !driver.user_type.type_id.outsourcing,
    ) || [];

  const hasMore =
    outsourceDrivers?.staffs.pagination.count || 0 > drivers.length;

  useEffect(() => {
    setLimit(10);
  }, [driverSearch]);

  const handleOutsourceStatus = (data: DriverOutsourceType) => {
    updateOutsourceMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["outsourceDrivers"] });
        refetch();
        setIsAddDialogOpen(false);
      },
    });
  };

  const [selectedDriverId, setSelectedDriverId] = useState<DriverData | null>(
    null,
  );

  const [open, setOpen] = useState(false);

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

  //   Handlers
  // 🔑 Handlers
  const handleSaveBooking = () => {
    if (
      !bookingForm.cooperate_user_id ||
      !bookingForm.contract_start ||
      !bookingForm.contract_end
    ) {
      toast.error(
        "Please fill in all required fields (User, Start Date, End Date).",
      );
      return;
    }

    // Safely format dates for the backend to avoid timezone shifts
    const payload = {
      ...bookingForm,
      cooperate_user_id: "69b2ccc0c36d75fcb04c553a",
      contract_start: `${bookingForm.contract_start}T00:00:00.000Z`,
      contract_end: `${bookingForm.contract_end}T00:00:00.000Z`,
    };

    if (editingBookingId) {
      const { cooperate_user_id, ...rest } = payload;

      editBooking.mutate(
        { ...rest, booking_id: editingBookingId },
        {
          onSuccess: () => setIsBookingModalOpen(false),
        },
      );
    } else {
      createBooking.mutate(payload, {
        onSuccess: () => setIsBookingModalOpen(false),
      });
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id);
    }
  };

  const openEditModal = (booking: any) => {
    setEditingBookingId(booking._id);
    setBookingForm({
      cooperate_user_id: booking.cooperate_user_id || "",
      buses_assigned: booking.buses_assigned || [],
      driver_assigned: booking.driver_assigned || [],
      contract_start: booking.contract_start
        ? booking.contract_start.split("T")[0]
        : "",
      contract_end: booking.contract_end
        ? booking.contract_end.split("T")[0]
        : "",
    });
    setIsBookingModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBookingId(null);
    setBookingForm({
      cooperate_user_id: "",
      buses_assigned: [],
      driver_assigned: [],
      contract_start: "",
      contract_end: "",
    });
    setIsBookingModalOpen(true);
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking type or client name"
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
              <Button
                onClick={openCreateModal}
                className="bg-[#0A1942] hover:bg-[#0A1942]/90 text-white"
              >
                <Plus className="h-4 w-4" />
                Add New Booking
              </Button>
            </div>

            {/* Second Add Table */}
            {/* --- SHARED CREATE / EDIT MODAL --- */}
            <Dialog
              open={isBookingModalOpen}
              onOpenChange={setIsBookingModalOpen}
            >
              <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2 border-b">
                  <DialogTitle>
                    {editingBookingId ? "Edit Booking" : "Create New Booking"}
                  </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto">
                  {/* Single Select: Co-operate User */}
                  <div className="space-y-2">
                    <Label>Co-operate User *</Label>
                    <Popover
                      open={userDropdownOpen}
                      onOpenChange={setUserDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal"
                        >
                          {bookingForm.cooperate_user_id
                            ? "User Selected (ID Linked)" // Update with finding user name if possible
                            : "Search and select user..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search user..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {/* ⚠️ REPLACE WITH YOUR ACTUAL DATA MAP */}
                            {cooperateUsersList?.map((user: any) => (
                              <CommandItem
                                key={user._id}
                                onSelect={() => {
                                  setBookingForm({
                                    ...bookingForm,
                                    cooperate_user_id: user._id,
                                  });
                                  setUserDropdownOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    bookingForm.cooperate_user_id === user._id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {user.company_name || user.first_name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Multi-Select: Buses Assigned */}
                  <div className="space-y-2">
                    <Label>Assign Buses</Label>
                    <Popover
                      open={busDropdownOpen}
                      onOpenChange={setBusDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                        >
                          {bookingForm.buses_assigned.length > 0
                            ? `${bookingForm.buses_assigned.length} Bus(es) Selected`
                            : "Search and assign buses..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search buses..." />
                          <CommandGroup className="max-h-64 overflow-auto">
                            {/* ⚠️ REPLACE WITH YOUR ACTUAL DATA MAP */}
                            {outsourceBuses?.buses.data?.map((bus: any) => (
                              <CommandItem
                                key={bus._id}
                                onSelect={() => {
                                  const exists =
                                    bookingForm.buses_assigned.includes(
                                      bus._id,
                                    );
                                  setBookingForm({
                                    ...bookingForm,
                                    buses_assigned: exists
                                      ? bookingForm.buses_assigned.filter(
                                          (id) => id !== bus._id,
                                        )
                                      : [
                                          ...bookingForm.buses_assigned,
                                          bus._id,
                                        ],
                                  });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    bookingForm.buses_assigned.includes(bus._id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {bus.id_code} - {bus.name_label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Multi-Select: Drivers Assigned */}
                  <div className="space-y-2">
                    <Label>Assign Drivers</Label>
                    <Popover
                      open={driverDropdownOpen}
                      onOpenChange={setDriverDropdownOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                        >
                          {bookingForm.driver_assigned.length > 0
                            ? `${bookingForm.driver_assigned.length} Driver(s) Selected`
                            : "Search and assign drivers..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search drivers..." />
                          <CommandGroup className="max-h-64 overflow-auto">
                            {/* ⚠️ REPLACE WITH YOUR ACTUAL DATA MAP */}
                            {outsourceDrivers?.staffs.data?.map(
                              (driver: any) => (
                                <CommandItem
                                  key={driver._id}
                                  onSelect={() => {
                                    const exists =
                                      bookingForm.driver_assigned.includes(
                                        driver._id,
                                      );
                                    setBookingForm({
                                      ...bookingForm,
                                      driver_assigned: exists
                                        ? bookingForm.driver_assigned.filter(
                                            (id) => id !== driver._id,
                                          )
                                        : [
                                            ...bookingForm.driver_assigned,
                                            driver._id,
                                          ],
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      bookingForm.driver_assigned.includes(
                                        driver._id,
                                      )
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {driver.first_name} {driver.last_name}
                                </CommandItem>
                              ),
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Contract Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Start *</Label>
                      <Input
                        type="date"
                        value={bookingForm.contract_start}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            contract_start: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contract End *</Label>
                      <Input
                        type="date"
                        value={bookingForm.contract_end}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            contract_end: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-muted/30 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveBooking}
                    className="bg-[#0A1942] hover:bg-[#0A1942]/90 text-white"
                    disabled={createBooking.isPending || editBooking.isPending}
                  >
                    {(createBooking.isPending || editBooking.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingBookingId ? "Update Booking" : "Create Booking"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Update Driver Outsourcing  */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">
            All Bookings
          </CardTitle>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Client
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Client Type
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Bus Assigned
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Drivers Assigned
                </th>

                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Rental Charge Rate
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Contract Start
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Contract End
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Created At
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
                filteredData.length > 0 &&
                filteredData.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    {booking.added_by ? (
                      <td className="p-4 text-sm font-medium">
                        {booking.added_by.user_type.value == "corporate"
                          ? booking.added_by.user_type.type_id.company_name
                          : `${booking.added_by.first_name} ${booking.added_by.last_name}`}
                      </td>
                    ) : (
                      <td className="p-4 text-sm font-medium">
                        No user assigned
                      </td>
                    )}
                    <td className="p-4 text-sm capitalize font-medium">
                      {booking.added_by
                        ? booking.added_by.user_type.value
                        : "No User Type"}
                    </td>
                    <td className="p-4">{booking.buses_assigned.name_label}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {booking.driver_assigned.first_name}{" "}
                      {booking.driver_assigned.last_name}
                    </td>

                    <td className="p-4 text-sm text-muted-foreground">
                      ₦{booking.rental_charge_rate.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(booking.contract_start).toDateString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(booking.contract_end).toDateString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal capitalize",
                          booking.status === "paid"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toDateString()}
                    </td>
                    <td className="p-4">
                      {/* <DropdownMenu>
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Edit Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Delete Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}

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
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>

                          {/* 🔑 Edit Action */}
                          <DropdownMenuItem
                            onClick={() => openEditModal(booking)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Booking
                          </DropdownMenuItem>

                          {/* 🔑 Delete Action */}
                          <DropdownMenuItem
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-destructive cursor-pointer hover:bg-destructive/10"
                            disabled={deleteBooking.isPending}
                          >
                            {deleteBooking.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4 mr-2" />
                            )}
                            Delete Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && filteredData.length === 0 && (
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

        {/* Driver Outsource Modal */}
        <Dialog
          open={isDriverOutsourceModalOpen}
          onOpenChange={setIsDriverOutsourceModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Driver Outsourcing Amount</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="driver_outsource_amount">Amount Per Day</Label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                    ₦
                  </span>
                  <Input
                    id="driver_outsource_amount"
                    type="number"
                    value={driverOutsourceAmount}
                    onChange={(e) => setDriverOutsourceAmount(e.target.value)}
                    className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Enter daily outsource amount"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDriverOutsourceModalOpen(false)}
                disabled={updateOutsourceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (
                    !driverOutsourceAmount ||
                    Number(driverOutsourceAmount) <= 0
                  ) {
                    toast.error("Please enter a valid amount per day.");
                    return;
                  }

                  if (selectedDriverForOutsource) {
                    handleOutsourceStatus({
                      outsourcing: true,
                      amount_per_day: Number(driverOutsourceAmount),
                      driver_id: selectedDriverForOutsource,
                    });
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={updateOutsourceMutation.isPending}
              >
                {updateOutsourceMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Confirm Outsourcing"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* End In-House Drivers */}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select
              value={itemsPerPage}
              onChange={(e) => setBookingsItemsPerPage(Number(e.target.value))}
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
              onClick={() => setBookingCurrentPage((prev) => prev - 1)}
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
                  onClick={() => setBookingCurrentPage(pageNumber)}
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
              onClick={() => setBookingCurrentPage((prev) => prev + 1)}
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
