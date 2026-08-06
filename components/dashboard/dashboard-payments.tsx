import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminTripPayments, getAdminTripPaymentById } from "@/api/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  User,
  Bus,
  Calendar,
  Hash,
  ArrowRight,
  Clock,
} from "lucide-react";

const DashboardTripPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["trip-payments", currentPage],
    retry: false,
    queryFn: () => getAdminTripPayments(currentPage, 10),
  });

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["trip-payment-detail", selectedId],
    queryFn: () => getAdminTripPaymentById(selectedId!),
    enabled: !!selectedId,
  });

  const trips = data?.trip_payment?.data || [];
  const pagination = data?.trip_payment?.pagination || {
    page: 1,
    totalPages: 1,
  };

  const detail = detailData?.trip_payment;

  const formatCurrency = (amount: number) => `₦${amount?.toLocaleString()}`;
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    successful: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const TableRowSkeleton = () => (
    <tr className="border-b border-border animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Trips
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              All customer trip payment records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Seats</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : trips.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No trip payments found
                  </td>
                </tr>
              ) : (
                trips.map((trip: any) => (
                  <tr
                    key={trip._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[120px]">
                      {trip._id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 max-w-[200px]">
                        <span className="text-gray-700 text-xs font-medium truncate capitalize">
                          {trip.start_location?.value}
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <ArrowRight size={10} />
                          <span className="text-xs truncate capitalize">
                            {trip.destination?.value}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{trip.type}</td>
                    <td className="px-6 py-4">{trip.number_of_sit}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(trip.amount_paid)}
                    </td>
                    <td className="px-6 py-4">{formatDate(trip.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                          statusColors[trip.status] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleView(trip._id)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing Page <span className="font-medium">{pagination.page}</span>{" "}
            of <span className="font-medium">{pagination.totalPages}</span>
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === pagination.totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trip Payment Details</DialogTitle>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="space-y-3 pt-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : detail ? (
            <div className="space-y-5 pt-2">
              {/* Amount + Status Hero */}
              <div className="flex items-center justify-between bg-orange-50 rounded-xl px-5 py-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(detail.amount_paid)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${
                    statusColors[detail.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {detail.status}
                </span>
              </div>

              {/* Route */}
              <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Route
                </p>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="text-green-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-400">From</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {detail.start_location?.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">To</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {detail.destination?.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <Clock size={12} /> Trip Time
                  </p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {detail.time?.day}
                  </p>
                  <p className="text-xs text-gray-500">
                    {detail.time?.from} – {detail.time?.too}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {detail.time?.starting_date_formatted}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <Hash size={12} /> Trip Info
                  </p>
                  <p className="text-xs text-gray-500">
                    Seats:{" "}
                    <span className="font-semibold text-gray-800">
                      {detail.number_of_sit}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Type:{" "}
                    <span className="font-semibold text-gray-800 capitalize">
                      {detail.type}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Hash:{" "}
                    <span className="font-mono text-gray-700">
                      {detail.trip_hash}
                    </span>
                  </p>
                </div>
              </div>

              {/* Customer */}
              {detail.user_id && typeof detail.user_id === "object" && (
                <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    {detail.user_id.profile_image ? (
                      <img
                        src={detail.user_id.profile_image}
                        alt="Customer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <User size={20} className="text-orange-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Customer
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {detail.user_id.first_name} {detail.user_id.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.user_id.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.user_id.phone_number}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${
                      detail.user_id.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {detail.user_id.status}
                  </span>
                </div>
              )}

              {/* Bus */}
              {detail.bus_id && typeof detail.bus_id === "object" && (
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bus size={12} /> Vehicle
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {detail.bus_id.name_label}
                      </p>
                      <p className="text-xs text-gray-500">
                        Plate: {detail.bus_id.plate_number} · Capacity:{" "}
                        {detail.bus_id.capacity} seats
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Fuel: {detail.bus_id.fuel_type} · Mileage:{" "}
                        {detail.bus_id.mileage} km
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${
                        detail.bus_id.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {detail.bus_id.status}
                    </span>
                  </div>
                  {detail.bus_id.bus_photos?.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {detail.bus_id.bus_photos
                        .slice(0, 3)
                        .map((photo: string, i: number) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Bus photo ${i + 1}`}
                            className="w-20 h-14 rounded-lg object-cover border border-gray-100"
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Route Code + Distance */}
              {detail.trip_id && (
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Route Details
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Code</p>
                      <p className="font-mono font-semibold text-gray-800">
                        {detail.trip_id.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Distance</p>
                      <p className="font-semibold text-gray-800">
                        {detail.trip_id.route_distance} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Flat Rate</p>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(detail.trip_id.flat_rate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation reason if present */}
              {detail.cancellation_reason && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
                    Cancellation Reason
                  </p>
                  <p className="text-sm text-red-700">
                    {detail.cancellation_reason}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex gap-6 text-xs text-gray-400 pt-1 border-t border-gray-100">
                <div>
                  <span className="block text-gray-400">Created</span>
                  <span className="text-gray-600">
                    {formatDate(detail.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400">Updated</span>
                  <span className="text-gray-600">
                    {formatDate(detail.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardTripPayments;
