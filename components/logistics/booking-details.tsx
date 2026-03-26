import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getCooperateAccounts,
  useCreateBooking,
  useEditBooking,
} from "@/api/bookings";
import { getOutsouceBuses, getOutsouceDrivers } from "@/api/outsourcing-driver";

const BookingDetails = () => {
  const { selBooking } = useSelector((state: RootState) => state.bookings);

  // Helper functions for formatting
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const router = useRouter();

  // 🔑 Modal & Form States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [busDropdownOpen, setBusDropdownOpen] = useState(false);
  const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [bookingForm, setBookingForm] = useState({
    cooperate_user_id: "",
    buses_assigned: [] as string[],
    driver_assigned: [] as string[],
    contract_start: "",
    contract_end: "",
  });

  const openEditModal = (booking: any) => {
    setEditingBookingId(booking._id);

    // Safely extract the user ID whether it's in 'added_by', a populated object, or a raw string
    const clientId =
      booking.added_by?._id ||
      booking.cooperate_user_id?._id ||
      booking.cooperate_user_id ||
      "";

    setBookingForm({
      cooperate_user_id: clientId,
      buses_assigned:
        booking.buses_assigned?.map((bus: any) => bus._id || bus) || [],
      driver_assigned:
        booking.driver_assigned?.map((driver: any) => driver._id || driver) ||
        [],
      contract_start: booking.contract_start
        ? booking.contract_start.split("T")[0]
        : "",
      contract_end: booking.contract_end
        ? booking.contract_end.split("T")[0]
        : "",
    });
    setIsBookingModalOpen(true);
  };

  // Client Data
  const {
    data: clientData,
    fetchNextPage: fetchNextClientPage,
    hasNextPage: hasNextBusClientPage,
    isFetchingNextPage: isFetchingMoreClientData,
  } = useInfiniteQuery({
    queryKey: ["co-operate"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getCooperateAccounts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.corporate?.pagination?.totalPages || 1;
      return allPages.length < totalPages ? allPages?.length + 1 : undefined;
    },
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

  const createBooking = useCreateBooking();
  const editBooking = useEditBooking();

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

  // Client Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchLower = searchQuery.toLowerCase();

  const allClients =
    clientData?.pages.flatMap((page) => page?.corporate?.data || []) || [];

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
      contract_start: `${bookingForm.contract_start}T00:00:00.000Z`,
      contract_end: `${bookingForm.contract_end}T00:00:00.000Z`,
    };

    if (editingBookingId) {
      const { cooperate_user_id, ...rest } = payload;

      editBooking.mutate(
        { ...rest, booking_id: editingBookingId },
        {
          onSuccess: () => {
            setIsBookingModalOpen(false);
            router.back()
          },
        },
      );
    } else {
      createBooking.mutate(payload, {
        onSuccess: () => setIsBookingModalOpen(false),
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Bookings
        </Button>
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Booking Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {selBooking?._id}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${selBooking?.status === "paid" ? "text-green-600 bg-green-100 border-green-200" : "text-orange-600 bg-orange-100 border-orange-200"} border capitalize`}
            >
              {selBooking?.status}
            </span>
            <button
              onClick={() => openEditModal(selBooking)}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Edit Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Overview & Client Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                Contract Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Rental Charge Rate</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatCurrency(selBooking?.rental_charge_rate || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Type</p>
                  <p className="font-semibold text-gray-800 mt-1 capitalize">
                    {selBooking?.booking_type.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatDate(selBooking?.createdAt || "")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contract Start</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatDate(selBooking?.contract_start || "")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contract End</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {formatDate(selBooking?.contract_end || "")}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                Client Details
              </h2>

              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={selBooking?.added_by.profile_image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {selBooking?.added_by.first_name}{" "}
                    {selBooking?.added_by.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {selBooking?.added_by.email} •{" "}
                    {selBooking?.added_by.phone_number}
                  </p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded uppercase tracking-wider">
                    {selBooking?.added_by.user_type.value} Account
                  </span>
                </div>
              </div>

              {selBooking?.added_by.user_type.value === "corporate" && (
                <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Company Name</p>
                    <p className="font-medium text-gray-800">
                      {selBooking.added_by.user_type.type_id.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">RC Number</p>
                    <p className="font-medium text-gray-800">
                      {
                        selBooking.added_by.user_type.type_id
                          .registration_number
                      }
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 mb-1">Operating Address</p>
                    <p className="font-medium text-gray-800">
                      {selBooking.added_by.user_type.type_id.operating_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Assets & Personnel */}
          <div className="space-y-6">
            {/* Assigned Buses */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                Assigned Vehicles
              </h2>
              {selBooking?.buses_assigned.map((bus) => (
                <div key={bus._id} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">
                      {bus.name_label}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Code: {bus.id_code}
                    </span>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {bus.bus_photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Bus photo ${index + 1}`}
                        className="w-24 h-20 object-cover rounded border border-gray-200 shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Assigned Drivers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
                Assigned Drivers
              </h2>
              <div className="space-y-4">
                {selBooking?.driver_assigned.map((driver) => (
                  <div
                    key={driver._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <img
                      src={driver.profile_image}
                      alt={`${driver.first_name} ${driver.last_name}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {driver.first_name} {driver.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Modal  */}
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
                            ? allClients?.find(
                                (c: any) =>
                                  c._id === bookingForm.cooperate_user_id,
                              )?.user_type?.type_id?.company_name ||
                              allClients?.find(
                                (c: any) =>
                                  c._id === bookingForm.cooperate_user_id,
                              )?.first_name ||
                              "User Selected"
                            : "Search and select user..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Search user..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {/* ⚠️ REPLACE WITH YOUR ACTUAL DATA MAP */}
                            {allClients
                              ?.filter((client: any) =>
                                `${client.user_type.type_id.company_name}`
                                  .toLowerCase()
                                  .includes(searchLower),
                              )
                              .map((client: any) => (
                                <CommandItem
                                  key={client._id}
                                  onSelect={() => {
                                    setBookingForm({
                                      ...bookingForm,
                                      cooperate_user_id: client._id,
                                    });
                                    setUserDropdownOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      bookingForm.cooperate_user_id ===
                                        client._id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {client.user_type.type_id.company_name ||
                                    client.first_name}
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
            {/* End Edit Modal */}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
