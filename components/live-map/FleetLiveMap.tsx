"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bus as BusIcon, ChevronRight, MapPinOff, Radio } from "lucide-react";
import { getOngoingTrips } from "@/api/routes";
import { getAllBuses } from "@/api/buses";
import { useWatchDrivers } from "@/hooks/use-watch-drivers";
import { toLatLng } from "@/lib/trip-geo";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusLiveMap, LiveVehicle } from "../buses/bus-live-map";

// New trips start / old ones end while the page is open.
const TRIPS_REFRESH_MS = 30_000;
// A live position older than this is shown greyed out as "last known".
const STALE_AFTER_MS = 2 * 60_000;

type DriverInfo = { name: string; busCode: string; tripIds: string[] };

const ago = (iso: string | undefined, now: number) => {
  if (!iso) return null;
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Every bus on an ongoing trip on one map, moving live. Uses the same feed as
// the single-trip page (`admin:watch_drivers` → `driver:location`), watching
// the drivers of every bus whose assigned routes include an ongoing trip.
export function FleetLiveMap() {
  const { data: ongoingTrips, isLoading } = useQuery({
    queryKey: ["ongoingTotal"],
    queryFn: () => getOngoingTrips(),
    refetchInterval: TRIPS_REFRESH_MS,
  });
  const { data: buses } = useQuery({
    queryKey: ["allBuses"],
    queryFn: () => getAllBuses(),
    refetchInterval: 5 * 60_000,
  });

  const trips = useMemo(() => ongoingTrips?.trip_route ?? [], [ongoingTrips]);
  const tripById = useMemo(() => new Map(trips.map((t) => [t._id, t])), [trips]);

  // Driver → bus, and which of the ongoing trips that driver's buses serve.
  const drivers = useMemo(() => {
    const map = new Map<string, DriverInfo>();
    (buses?.buses.data ?? []).forEach((bus) => {
      const tripIds = (bus.routes_assigned ?? [])
        .map((r) => r._id)
        .filter((id) => tripById.has(id));
      if (tripIds.length === 0) return;
      (bus.drivers_assigned ?? []).forEach((d) => {
        const existing = map.get(d._id);
        map.set(d._id, {
          name: `${d.first_name} ${d.last_name}`.trim(),
          busCode: existing ? `${existing.busCode}, ${bus.id_code}` : bus.id_code,
          tripIds: [...new Set([...(existing?.tripIds ?? []), ...tripIds])],
        });
      });
    });
    return map;
  }, [buses, tripById]);

  const locations = useWatchDrivers([...drivers.keys()]);

  // Re-render every 10s so "x s ago" and staleness stay current.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(timer);
  }, []);

  const vehicles = useMemo(() => {
    const list: (LiveVehicle & { tripId: string })[] = [];
    drivers.forEach((info, driverId) => {
      const loc = locations[driverId];
      if (!loc) return;
      // The driver app reports which trip it is driving. Trust that; only
      // when it's missing, use the bus's single ongoing route.
      const tripId = loc.trip_id
        ? tripById.has(loc.trip_id)
          ? loc.trip_id
          : null
        : info.tripIds.length === 1
          ? info.tripIds[0]
          : null;
      if (!tripId) return;
      const trip = tripById.get(tripId)!;
      list.push({
        id: driverId,
        tripId,
        position: { lat: loc.lat, lng: loc.lng },
        heading: loc.heading,
        label: `${trip.code} · ${info.busCode}`,
        tag: trip.code,
        subtitle: `${info.name} — ${trip.starting_point.value.split(",")[0]} → ${trip.destination.value.split(",")[0]}`,
        href: `/trips/${tripId}`,
        lastUpdated: loc.receivedAt,
        stale: now - new Date(loc.receivedAt).getTime() > STALE_AFTER_MS,
      });
    });

    // Trips with no live driver yet: their last stored bus position, greyed.
    trips.forEach((trip) => {
      if (list.some((v) => v.tripId === trip._id)) return;
      const lastKnown = toLatLng(trip.ongoing?.value?.current_location);
      if (!lastKnown) return;
      list.push({
        id: `trip-${trip._id}`,
        tripId: trip._id,
        position: lastKnown,
        label: trip.code,
        tag: trip.code,
        subtitle: `${trip.starting_point.value.split(",")[0]} → ${trip.destination.value.split(",")[0]}`,
        href: `/trips/${trip._id}`,
        lastUpdated: trip.ongoing?.value?.current_location?.updatedAt,
        stale: true,
      });
    });
    return list;
  }, [drivers, locations, tripById, trips, now]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const liveCount = vehicles.filter((v) => !v.stale).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Live Fleet Map</h2>
          <p className="text-sm text-muted-foreground">
            Every bus on an ongoing trip, updating live. Click a bus or trip for details.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm border">
            <strong>{trips.length}</strong> ongoing trip{trips.length === 1 ? "" : "s"}
          </span>
          <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 border border-green-100">
            <strong>{liveCount}</strong> bus{liveCount === 1 ? "" : "es"} live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        <Card className="p-0 overflow-hidden order-2 lg:order-1 lg:h-[calc(100vh-200px)] flex flex-col">
          <div className="px-4 py-3 border-b text-sm font-semibold">Ongoing trips</div>
          <div className="flex-1 overflow-y-auto divide-y">
            {isLoading &&
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            {!isLoading && trips.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No trips are ongoing right now.
              </div>
            )}
            {trips.map((trip) => {
              const tripVehicles = vehicles.filter((v) => v.tripId === trip._id);
              const live = tripVehicles.filter((v) => !v.stale);
              const newest = tripVehicles
                .map((v) => v.lastUpdated)
                .filter(Boolean)
                .sort()
                .pop();
              const selected = tripVehicles.some((v) => v.id === selectedId);
              return (
                <div
                  key={trip._id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selected ? "bg-orange-50" : "hover:bg-muted/50"
                  }`}
                  onClick={() => tripVehicles[0] && setSelectedId(tripVehicles[0].id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{trip.code}</span>
                    {live.length > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-green-700">
                        <Radio className="h-3 w-3" />
                        {live.length > 1 ? `${live.length} buses live` : "Live"}
                      </span>
                    ) : tripVehicles.length > 0 ? (
                      <span className="text-xs text-amber-600">Last known</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPinOff className="h-3 w-3" />
                        No location
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {trip.starting_point.value.split(",")[0]} →{" "}
                    {trip.destination.value.split(",")[0]}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <BusIcon className="h-3 w-3" />
                      {trip.ongoing?.routine?.[0]
                        ? `${trip.ongoing.routine[0].from} – ${trip.ongoing.routine[0].too}`
                        : "—"}
                      {newest && ` · ${ago(newest, now)}`}
                    </span>
                    <Link
                      href={`/trips/${trip._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center font-medium text-orange-600 hover:underline"
                    >
                      Open <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden order-1 lg:order-2 h-[60vh] lg:h-[calc(100vh-200px)]">
          <BusLiveMap
            vehicles={vehicles}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="!min-h-0"
          />
        </Card>
      </div>
    </div>
  );
}
