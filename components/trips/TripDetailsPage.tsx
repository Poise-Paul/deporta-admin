"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "../ui/back-button";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOngoingTrips } from "@/api/routes";
import { getAllBuses } from "@/api/buses";
import { useWatchDrivers } from "@/hooks/use-watch-drivers";
import { calculateETA } from "@/utils/timeConvert";
import { SearchX } from "lucide-react";
import { useMemo } from "react";
import {
  BusLiveMap,
  LiveVehicle,
  MapWaypoint,
} from "../buses/bus-live-map";

// GeoJSON coordinates are [longitude, latitude].
const toLatLng = (coords?: [number, number]) =>
  coords && coords.length === 2 ? { lat: coords[1], lng: coords[0] } : null;

export function TripDetailView() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // Same query as the ongoing trips list, so this is usually served from cache.
  const { data: ongoingTrips, isLoading } = useQuery({
    queryKey: ["ongoingTotal"],
    queryFn: () => getOngoingTrips(),
  });

  const trip = ongoingTrips?.trip_route.find((t) => t._id === id);

  // Trips don't carry drivers, so watch the drivers of every bus on this route.
  const { data: buses } = useQuery({
    queryKey: ["allBuses"],
    queryFn: () => getAllBuses(),
  });
  const routeDrivers = useMemo(
    () =>
      (buses?.buses.data ?? [])
        .filter((bus) => bus.routes_assigned?.some((r) => r._id === id))
        .flatMap((bus) =>
          (bus.drivers_assigned ?? []).map((d) => ({
            id: d._id,
            label: `${d.first_name} ${d.last_name} · ${bus.id_code}`,
          })),
        ),
    [buses, id],
  );
  const driverLocations = useWatchDrivers(routeDrivers.map((d) => d.id));

  // One pin per driver on this trip. A driver reporting a different trip_id
  // is driving another trip right now, so leave them off this map.
  const liveVehicles: LiveVehicle[] = routeDrivers
    .filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i)
    .flatMap((d) => {
      const loc = driverLocations[d.id];
      if (!loc || (loc.trip_id && loc.trip_id !== id)) return [];
      return [
        {
          id: d.id,
          position: { lat: loc.lat, lng: loc.lng },
          label: d.label,
          lastUpdated: loc.receivedAt,
        },
      ];
    });

  const waypoints = useMemo<MapWaypoint[]>(() => {
    if (!trip) return [];
    const points: (MapWaypoint | null)[] = [
      (() => {
        const p = toLatLng(trip.starting_point.location?.coordinates);
        return p
          ? { position: p, label: trip.starting_point.value, kind: "pickup" }
          : null;
      })(),
      ...(trip.number_of_stops ?? []).map((stop) => {
        const p = toLatLng(stop.coordinates);
        return p ? { position: p, label: stop.value, kind: "stop" as const } : null;
      }),
      (() => {
        const p = toLatLng(trip.destination.location?.coordinates);
        return p
          ? { position: p, label: trip.destination.value, kind: "destination" }
          : null;
      })(),
    ];
    return points.filter((w): w is MapWaypoint => w !== null);
  }, [trip]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <BackButton onClick={() => router.back()} label="All Ongoing Trips" />
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
          <SearchX className="h-8 w-8 text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-bold">Trip not found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            This trip is no longer ongoing or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const ongoing = trip.ongoing?.value;
  const schedule = trip.ongoing?.routine?.[0];
  const busImage = ongoing?.bus_image?.[0];
  // Until the tracking socket is live, fall back to the pickup point.
  const busPosition =
    toLatLng(ongoing?.current_location?.coordinates) ?? waypoints[0]?.position;
  const mapVehicles: LiveVehicle[] =
    liveVehicles.length > 0
      ? liveVehicles
      : busPosition
        ? [
            {
              id: "bus",
              position: busPosition,
              label: trip.code,
              lastUpdated: ongoing?.current_location?.updatedAt,
            },
          ]
        : [];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <BackButton onClick={() => router.back()} label="All Ongoing Trips" />

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{trip.code}</h2>
          {schedule && (
            <p className="text-muted-foreground">
              Scheduled {schedule.from} – {schedule.too}
            </p>
          )}
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
          Ongoing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: The Route */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Route Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-primary" />
                  <p className="font-bold capitalize">
                    {trip.starting_point.value}
                  </p>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                </div>
                {trip.number_of_stops?.map((stop, i) => (
                  <div key={stop.location_id ?? i} className="relative">
                    <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-gray-300" />
                    <p className="text-sm font-medium capitalize">
                      {stop.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stop {i + 1}
                    </p>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[33px] w-4 h-4 rounded-full border-2 border-primary bg-white" />
                  <p className="font-bold capitalize">
                    {trip.destination.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Destination · ~{calculateETA(Number(trip.route_distance))}{" "}
                    ({trip.route_distance} km)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {mapVehicles.length > 0 && (
            <Card className="p-0 overflow-hidden">
              <BusLiveMap vehicles={mapVehicles} waypoints={waypoints} />
            </Card>
          )}
        </div>

        {/* Column 2: Passengers & Bus Info */}
        <div className="space-y-4">
          <Card className="bg-orange-50/50 border-orange-100">
            <CardHeader>
              <CardTitle className="text-sm">Passengers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats taken</span>
                <span className="font-bold">{ongoing?.capacity_taken ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">On board</span>
                <span className="font-bold">
                  {ongoing?.customer_with_ongoing_status ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending pickup</span>
                <span className="font-bold">
                  {ongoing?.customer_with_pending_status ?? 0}
                </span>
              </div>
              {ongoing?.free_capacity != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free seats</span>
                  <span className="font-bold">{ongoing.free_capacity}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={busImage || "/placeholder.svg"}
                alt="Bus"
                className="w-full h-32 rounded-lg object-cover border border-gray-100"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
