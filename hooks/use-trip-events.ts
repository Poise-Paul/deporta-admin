"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";

// Payload of the server's `trip:started:admin` event.
export interface TripStartedAdminPayload {
  driver_id?: string;
  trip_id?: string;
  bus_id?: string;
  from?: string;
  too?: string;
  day?: string;
  total_customers?: number;
}

const TRIP_STARTED_ADMIN = "trip:started:admin";

// The backend broadcasts trip events to drivers and customers on the same
// socket, so only the `:admin` start event is handled here; the customer one
// (`trip:started`, one per payment) is ignored. Completion is matched loosely
// (trip:completed / trip:complete / trip:ended / trip:end / trip:finished,
// with or without `:admin`) until its exact name is settled with the backend.
const TRIP_FINISHED = /^trip:(completed?|ended?|finished)(:admin)?$/;

// Queries that list or count ongoing trips, refreshed on every trip event.
const ONGOING_TRIP_QUERIES = [["ongoingTotal"]];

// Listens for trips starting and finishing and refreshes every ongoing-trip
// list (dashboard, trips page, trip page, live map) straight away instead of
// waiting for the next poll. Mount once, inside the authenticated layout.
export function useTripEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const refreshOngoing = () =>
      ONGOING_TRIP_QUERIES.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );

    const onTripStarted = (payload: TripStartedAdminPayload) => {
      refreshOngoing();
      // The bus list maps drivers to trips; refresh it so a newly assigned
      // driver starts being watched on the map.
      queryClient.invalidateQueries({ queryKey: ["allBuses"] });
      const when = [payload?.from, payload?.too].filter(Boolean).join(" – ");
      toast.success("Trip started", {
        // One toast per trip, however many times the event repeats.
        id: `trip-started-${payload?.trip_id ?? ""}`,
        description: [
          when && `Scheduled ${when}`,
          payload?.total_customers != null &&
            `${payload.total_customers} customer${payload.total_customers === 1 ? "" : "s"}`,
        ]
          .filter(Boolean)
          .join(" · ") || undefined,
      });
    };

    const onAnyEvent = (event: string) => {
      if (!TRIP_FINISHED.test(event)) return;
      refreshOngoing();
      // The same completion can arrive once per customer; show one toast.
      toast("Trip completed", { id: "trip-completed" });
    };

    socket.on(TRIP_STARTED_ADMIN, onTripStarted);
    socket.onAny(onAnyEvent);
    return () => {
      socket.off(TRIP_STARTED_ADMIN, onTripStarted);
      socket.offAny(onAnyEvent);
    };
  }, [queryClient]);
}
