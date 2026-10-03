"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

const WATCH_INTERVAL_MS = 5000;

// Payload of the server's `driver:location` event.
export interface DriverLocation {
  driver_user_id: string;
  lat: number;
  lng: number;
  heading?: number;
  trip_id?: string;
  // Server time of the fix, in epoch milliseconds.
  timestamp?: number;
  // True when the server answered from its last-known cache.
  from_cache?: boolean;
  // When the location was recorded (server timestamp, else time received).
  receivedAt: string;
}

type RawDriverLocation = Omit<DriverLocation, "receivedAt">;

// Emits `admin:watch_drivers` with the given driver user ids (`user_ids`) every 5 seconds and
// returns the latest `driver:location` for each of them, keyed by driver id.
export function useWatchDrivers(driverIds: string[]) {
  const [locations, setLocations] = useState<Record<string, DriverLocation>>(
    {},
  );
  const idsKey = [...new Set(driverIds.filter(Boolean))].sort().join(",");

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    // Drop pins for drivers we're no longer watching.
    setLocations((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => ids.includes(id)),
      ),
    );
    if (ids.length === 0) return;

    const socket = getSocket();

    const isValid = (loc: RawDriverLocation | undefined) =>
      !!loc?.driver_user_id &&
      ids.includes(loc.driver_user_id) &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number";

    const applyLocations = (incoming: RawDriverLocation[]) => {
      const valid = incoming.filter(isValid);
      if (valid.length === 0) return;
      setLocations((prev) => {
        const next = { ...prev };
        valid.forEach((loc) => {
          // Never let an older (e.g. cached) fix overwrite a newer one.
          const current = next[loc.driver_user_id];
          if (
            current?.timestamp &&
            loc.timestamp &&
            loc.timestamp < current.timestamp
          ) {
            return;
          }
          next[loc.driver_user_id] = {
            ...loc,
            receivedAt: new Date(loc.timestamp ?? Date.now()).toISOString(),
          };
        });
        return next;
      });
    };

    // Batch shape: { locations: { [driverId]: location } }.
    const onBatch = (payload: unknown) => {
      const locs = (payload as { locations?: Record<string, RawDriverLocation> })
        ?.locations;
      if (locs && typeof locs === "object") applyLocations(Object.values(locs));
    };

    // Single shape from `driver:location`.
    const onLocation = (payload: RawDriverLocation) => applyLocations([payload]);

    // The batch may arrive as the emit's ack or as its own event, so accept
    // it from either.
    const onAnyEvent = (event: string, payload: unknown) => {
      if (event !== "driver:location") onBatch(payload);
    };

    const watch = () => {
      // Timeout so unanswered acks don't pile up if the server never replies.
      socket
        .timeout(WATCH_INTERVAL_MS - 500)
        .emit("admin:watch_drivers", { user_ids: ids }, (err: unknown, res: unknown) => {
          if (!err) onBatch(res);
        });
    };

    if (socket.connected) watch();
    socket.on("connect", watch);
    socket.on("driver:location", onLocation);
    socket.onAny(onAnyEvent);
    const interval = setInterval(watch, WATCH_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      socket.off("connect", watch);
      socket.off("driver:location", onLocation);
      socket.offAny(onAnyEvent);
    };
  }, [idsKey]);

  return locations;
}
