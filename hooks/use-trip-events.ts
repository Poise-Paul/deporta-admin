"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";

// Payload of the server's `trip:started:admin` and `trip:completed:admin`
// events (both carry the same fields).
export interface TripAdminPayload {
  driver_id?: string;
  trip_id?: string;
  bus_id?: string;
  from?: string;
  too?: string;
  day?: string;
  total_customers?: number;
}

// The backend sends trip events to drivers and customers on the same socket.
// Customers get `trip:started` / `trip:completed` (one per payment); the
// admin portal ignores those and handles only the `:admin` events below.
const TRIP_STARTED_ADMIN = "trip:started:admin";
const TRIP_COMPLETED_ADMIN = "trip:completed:admin";

// "Scheduled 07:00 – 08:00 · 12 customers"
const describeTrip = (payload: TripAdminPayload | undefined) => {
  const when = [payload?.from, payload?.too].filter(Boolean).join(" – ");
  const customers = payload?.total_customers;
  return (
    [
      when && `Scheduled ${when}`,
      customers != null && `${customers} customer${customers === 1 ? "" : "s"}`,
    ]
      .filter(Boolean)
      .join(" · ") || undefined
  );
};

// Listens for trips starting and completing and refreshes every ongoing-trip
// list (dashboard, trips page, trip page, live map) straight away instead of
// waiting for the next poll. Mount once, inside the authenticated layout.
export function useTripEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const refreshOngoing = () =>
      queryClient.invalidateQueries({ queryKey: ["ongoingTotal"] });

    const onTripStarted = (payload: TripAdminPayload) => {
      refreshOngoing();
      // The bus list maps drivers to trips; refresh it so a newly assigned
      // driver starts being watched on the map.
      queryClient.invalidateQueries({ queryKey: ["allBuses"] });
      toast.success("Trip started", {
        // One toast per trip, however many times the event repeats.
        id: `trip-started-${payload?.trip_id ?? ""}`,
        description: describeTrip(payload),
      });
    };

    const onTripCompleted = (payload: TripAdminPayload) => {
      refreshOngoing();
      toast("Trip completed", {
        id: `trip-completed-${payload?.trip_id ?? ""}`,
        description: describeTrip(payload),
      });
    };

    socket.on(TRIP_STARTED_ADMIN, onTripStarted);
    socket.on(TRIP_COMPLETED_ADMIN, onTripCompleted);
    return () => {
      socket.off(TRIP_STARTED_ADMIN, onTripStarted);
      socket.off(TRIP_COMPLETED_ADMIN, onTripCompleted);
    };
  }, [queryClient]);
}
