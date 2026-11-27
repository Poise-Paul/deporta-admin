"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  PolylineF,
} from "@react-google-maps/api";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { bearingDegrees, distanceMeters } from "@/lib/trip-geo";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapWaypoint {
  position: LatLng;
  label: string;
  kind: "pickup" | "stop" | "destination";
}

const WAYPOINT_COLORS: Record<MapWaypoint["kind"], string> = {
  pickup: "#ea580c",
  stop: "#6b7280",
  destination: "#16a34a",
};

export interface LiveVehicle {
  id: string;
  position: LatLng;
  label: string;
  // Short text drawn under the bus icon (e.g. the trip code) so several
  // buses can be told apart at a glance.
  tag?: string;
  // Extra line for the info window (e.g. "Elf Bus Stop → Civic Centre").
  subtitle?: string;
  // Link shown in the info window (e.g. the trip's page).
  href?: string;
  // Compass heading reported by the device, used until the bus has moved
  // far enough for its direction of travel to be worked out.
  heading?: number;
  lastUpdated?: string;
  // True when this is a last-known position rather than a live feed.
  stale?: boolean;
}

interface BusLiveMapProps {
  // One pin per vehicle/driver. Feed live socket updates into this prop and
  // the pins move with them.
  vehicles: LiveVehicle[];
  // Optional route points, in travel order (pickup, stops, destination).
  // When given, the road route through them is drawn with direction arrows.
  waypoints?: MapWaypoint[];
  // Vehicle whose info window should be open (and panned to).
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  // Open each vehicle's info window on first render (single-trip view).
  infoOpenByDefault?: boolean;
  className?: string;
}

const containerStyle = { width: "100%", height: "100%", minHeight: 400 };

// Only look the address up again once the bus has moved this far, so live
// updates every few seconds don't trigger a geocode call each time.
const REGEOCODE_DISTANCE_M = 50;
// Movement smaller than this is GPS wobble — it must not flip the arrow.
const MIN_HEADING_MOVE_M = 15;

// Short address like "Badore Road, Ajah" from a geocoder result.
const shortAddress = (result: google.maps.GeocoderResult) => {
  const get = (type: string) =>
    result.address_components.find((c) => c.types.includes(type))?.long_name;
  const street = get("route");
  const area =
    get("neighborhood") ??
    get("sublocality") ??
    get("sublocality_level_1") ??
    get("locality");
  const parts = [street, area].filter(
    (p, i, arr): p is string => !!p && arr.indexOf(p) === i,
  );
  return parts.length > 0
    ? parts.join(", ")
    : result.formatted_address.split(",").slice(0, 2).join(",");
};

// Bus disc with an arrow on its rim pointing the way the bus is travelling,
// so the admin can see its direction without watching it move.
const busIconSvg = (heading: number | null, stale: boolean) => {
  const fill = stale ? "#64748b" : "#0f172a";
  const arrow =
    heading === null
      ? ""
      : `<g transform="rotate(${heading} 26 26)"><path d="M26 0 L36 13 L26 10 L16 13 Z" fill="#ea580c" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">${arrow}<circle cx="26" cy="26" r="16" fill="${fill}" stroke="#fff" stroke-width="3"/><g transform="translate(17 17) scale(0.75)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></g></svg>`;
};

// Direction of travel from the bus's own movement. Until it has moved far
// enough to tell, the latest heading the phone reported is used (GPS course
// while driving). 0 is skipped: the driver app sends it when it has none.
function useTravelHeading(position: LatLng, reported?: number) {
  const anchorRef = useRef<LatLng | null>(null);
  const [travelHeading, setTravelHeading] = useState<number | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      anchorRef.current = position;
      return;
    }
    if (distanceMeters(anchor, position) < MIN_HEADING_MOVE_M) return;
    setTravelHeading(bearingDegrees(anchor, position));
    anchorRef.current = position;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.lat, position.lng]);

  const reportedHeading =
    typeof reported === "number" && reported > 0 && reported < 360
      ? reported
      : null;
  return travelHeading ?? reportedHeading;
}

function VehicleMarker({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: LiveVehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { position, label, lastUpdated, tag, subtitle, href, stale } = vehicle;
  const [address, setAddress] = useState<string | null>(null);
  const lastGeocodedRef = useRef<LatLng | null>(null);
  const geocodeRequestRef = useRef(0);
  const heading = useTravelHeading(position, vehicle.heading);
  // Round so a slowly turning bus doesn't rebuild the icon on every ping.
  const roundedHeading = heading === null ? null : Math.round(heading / 10) * 10;

  // Reverse-geocode the position into a readable address — only while the
  // info window is open, so a fleet of buses doesn't geocode constantly.
  useEffect(() => {
    if (!open) return;
    const last = lastGeocodedRef.current;
    if (last && distanceMeters(last, position) < REGEOCODE_DISTANCE_M) return;
    lastGeocodedRef.current = position;

    // Ignore responses that arrive after a newer lookup has started.
    const requestId = ++geocodeRequestRef.current;
    new google.maps.Geocoder()
      .geocode({ location: position })
      .then(({ results }) => {
        if (requestId === geocodeRequestRef.current && results[0]) {
          setAddress(shortAddress(results[0]));
        }
      })
      .catch((err) => console.error("Reverse geocode failed", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, position.lat, position.lng]);

  const icon = useMemo<google.maps.Icon>(
    () => ({
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(busIconSvg(roundedHeading, !!stale)),
      scaledSize: new google.maps.Size(52, 52),
      anchor: new google.maps.Point(26, 26),
      labelOrigin: new google.maps.Point(26, 58),
    }),
    [roundedHeading, stale],
  );

  return (
    <MarkerF
      position={position}
      title={label}
      zIndex={3}
      onClick={() => onOpenChange(true)}
      icon={icon}
      // Only the disc and its arrow are clickable, not the icon's transparent
      // corners, so stops right next to the bus can still be clicked.
      shape={{ type: "circle", coords: [26, 26, 20] }}
      label={
        tag
          ? {
              text: tag,
              color: "#0f172a",
              fontSize: "11px",
              fontWeight: "700",
            }
          : undefined
      }
    >
      {open && (
        <InfoWindowF position={position} onCloseClick={() => onOpenChange(false)}>
          <div className="text-xs space-y-0.5 max-w-[220px]">
            <p className="font-semibold">{label}</p>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
            {address && <p>{address}</p>}
            <p className="text-gray-500">
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
            {lastUpdated && (
              <p className="text-gray-500">
                {stale ? "Last known at" : "Updated"}{" "}
                {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
            {href && (
              <Link href={href} className="inline-block pt-1 font-semibold text-orange-600 hover:underline">
                Open trip →
              </Link>
            )}
          </div>
        </InfoWindowF>
      )}
    </MarkerF>
  );
}

// The road route through the waypoints, in travel order — one Directions
// request per set of waypoints. Falls back to straight segments if the
// request fails, so the order of travel is always visible.
function useRoadRoute(waypoints: MapWaypoint[] | undefined, enabled: boolean) {
  const [path, setPath] = useState<LatLng[] | null>(null);
  const key = (waypoints ?? [])
    .map((w) => `${w.position.lat.toFixed(5)},${w.position.lng.toFixed(5)}`)
    .join("|");

  useEffect(() => {
    if (!enabled || !waypoints || waypoints.length < 2) {
      setPath(null);
      return;
    }
    const straight = waypoints.map((w) => w.position);
    let cancelled = false;
    const [origin, ...rest] = waypoints;
    const destination = rest[rest.length - 1];
    new google.maps.DirectionsService()
      .route({
        origin: origin.position,
        destination: destination.position,
        // Directions allows up to 25 intermediate stops.
        waypoints: rest
          .slice(0, -1)
          .slice(0, 25)
          .map((w) => ({ location: w.position, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((result) => {
        if (cancelled) return;
        const overview = result.routes[0]?.overview_path;
        setPath(
          overview && overview.length > 1
            ? overview.map((p) => ({ lat: p.lat(), lng: p.lng() }))
            : straight,
        );
      })
      .catch((err) => {
        console.error("Route directions failed", err);
        if (!cancelled) setPath(straight);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return path;
}

export function BusLiveMap({
  vehicles,
  waypoints,
  selectedId,
  onSelect,
  infoOpenByDefault = false,
  className,
}: BusLiveMapProps) {
  // The Maps script is loaded globally in app/layout.tsx.
  const [isLoaded, setIsLoaded] = useState(
    () => typeof window !== "undefined" && !!window.google?.maps,
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (isLoaded) return;
    const interval = setInterval(() => {
      if (window.google?.maps) {
        setIsLoaded(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Info windows: controlled by the parent when it passes selectedId,
  // otherwise tracked here.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const vehicleIdsKey = vehicles.map((v) => v.id).join(",");
  // With infoOpenByDefault, each bus's window opens when it first appears.
  const seenIdsRef = useRef(new Set<string>());
  useEffect(() => {
    if (!infoOpenByDefault) return;
    const fresh = vehicles
      .map((v) => v.id)
      .filter((id) => !seenIdsRef.current.has(id));
    if (fresh.length === 0) return;
    fresh.forEach((id) => seenIdsRef.current.add(id));
    setOpenIds((prev) => new Set([...prev, ...fresh]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleIdsKey, infoOpenByDefault]);
  const controlled = selectedId !== undefined;
  const isOpen = (id: string) => (controlled ? selectedId === id : openIds.has(id));
  const setOpen = (id: string, open: boolean) => {
    if (controlled) {
      onSelect?.(open ? id : null);
      return;
    }
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const hasWaypoints = !!waypoints && waypoints.length > 0;
  const routePath = useRoadRoute(waypoints, isLoaded);
  // Pickup / stop / destination whose details are showing.
  const [openWaypoint, setOpenWaypoint] = useState<number | null>(null);

  // Frame the route and all vehicles whenever the set of pins changes
  // (not on every position update, so the admin can pan around freely).
  useEffect(() => {
    if (!map) return;
    const points = [
      ...(waypoints ?? []).map((w) => w.position),
      ...vehicles.map((v) => v.position),
    ];
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, hasWaypoints, vehicleIdsKey]);

  // With a single bus and no route, keep it in view as it moves.
  const single =
    !hasWaypoints && vehicles.length === 1 ? vehicles[0].position : null;
  useEffect(() => {
    if (single) map?.panTo(single);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, single?.lat, single?.lng]);

  // Bring the selected bus into view.
  const selected = controlled
    ? vehicles.find((v) => v.id === selectedId)?.position
    : null;
  useEffect(() => {
    if (selected && map) map.panTo(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedId]);

  // The bus being followed (the selected one, or the only one on the map)
  // is panned back into view if it drives off the visible area, so it never
  // looks frozen at the edge — most noticeable on the enlarged map.
  const followed =
    selected ?? (vehicles.length === 1 ? vehicles[0].position : null);
  useEffect(() => {
    if (!map || !followed) return;
    const bounds = map.getBounds();
    if (bounds && !bounds.contains(followed)) map.panTo(followed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, followed?.lat, followed?.lng]);

  // Enlarged view. This used to be Google's own fullscreen button, which
  // moves the map into the browser's fullscreen layer; admins saw the bus stop
  // moving there while the small map kept updating. Enlarging is now done in the
  // page itself (a fixed overlay around the same map instance), so the map
  // keeps rendering exactly as it does when small.
  const [enlarged, setEnlarged] = useState(false);
  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEnlarged(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [enlarged]);

  // Re-frame the route and buses for the new size once the map has resized.
  const prevEnlargedRef = useRef(enlarged);
  useEffect(() => {
    if (prevEnlargedRef.current === enlarged) return;
    prevEnlargedRef.current = enlarged;
    if (!map) return;
    const timer = setTimeout(() => {
      const points = [
        ...(waypoints ?? []).map((w) => w.position),
        ...vehicles.map((v) => v.position),
      ];
      if (points.length < 2) {
        if (points[0]) map.panTo(points[0]);
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 60);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enlarged]);

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg bg-muted">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  let stopNumber = 0;

  return (
    <div
      className={
        enlarged
          ? "fixed inset-0 z-[60] overflow-hidden bg-background"
          : `relative h-full min-h-[400px] overflow-hidden rounded-lg ${className ?? ""}`
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={vehicles[0]?.position ?? waypoints?.[0]?.position ?? { lat: 6.4474, lng: 3.4723 }}
        zoom={12}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          // Replaced by our own enlarge button (see `enlarged` above).
          fullscreenControl: false,
        }}
      >
        {routePath && (
          <PolylineF
            path={routePath}
            options={{
              strokeColor: "#ea580c",
              strokeOpacity: 0.75,
              strokeWeight: 4,
              zIndex: 1,
              // Arrows along the line show the direction of travel.
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2.5,
                    strokeColor: "#9a3412",
                    fillColor: "#9a3412",
                    fillOpacity: 1,
                  },
                  offset: "40px",
                  repeat: "90px",
                },
              ],
            }}
          />
        )}
        {waypoints?.map((w, i) => {
          const number = w.kind === "stop" ? ++stopNumber : null;
          const heading =
            w.kind === "pickup"
              ? "Pickup"
              : w.kind === "destination"
                ? "Destination"
                : `Stop ${number}`;
          return (
            <MarkerF
              key={`${w.kind}-${i}`}
              position={w.position}
              title={`${heading}: ${w.label}`}
              onClick={() => setOpenWaypoint(i)}
              zIndex={2}
              label={
                number !== null
                  ? { text: String(number), color: "#ffffff", fontSize: "10px", fontWeight: "700" }
                  : undefined
              }
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: w.kind === "stop" ? 8 : 9,
                fillColor: WAYPOINT_COLORS[w.kind],
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            >
              {openWaypoint === i && (
                <InfoWindowF
                  position={w.position}
                  onCloseClick={() => setOpenWaypoint(null)}
                >
                  <div className="text-xs space-y-0.5 max-w-[240px]">
                    <p
                      className="font-semibold"
                      style={{ color: WAYPOINT_COLORS[w.kind] }}
                    >
                      {heading}
                    </p>
                    <p className="capitalize">{w.label || "Unnamed location"}</p>
                    <p className="text-gray-500">
                      {w.position.lat.toFixed(5)}, {w.position.lng.toFixed(5)}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${w.position.lat},${w.position.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block pt-1 font-semibold text-orange-600 hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          );
        })}
        {vehicles.map((v) => (
          <VehicleMarker
            key={v.id}
            vehicle={v}
            open={isOpen(v.id)}
            onOpenChange={(open) => setOpen(v.id, open)}
          />
        ))}
      </GoogleMap>
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Live location
      </div>
      <button
        type="button"
        onClick={() => setEnlarged((v) => !v)}
        title={enlarged ? "Exit enlarged map (Esc)" : "Enlarge map"}
        aria-label={enlarged ? "Exit enlarged map" : "Enlarge map"}
        className="absolute right-[10px] top-[10px] flex h-10 w-10 items-center justify-center rounded-sm bg-white text-gray-600 shadow-[0_1px_4px_-1px_rgba(0,0,0,0.3)] hover:text-gray-900"
      >
        {enlarged ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </button>
      {hasWaypoints && (
        <div className="absolute left-3 bottom-8 flex flex-wrap items-center gap-3 rounded-md bg-white/90 px-3 py-1.5 text-[11px] shadow">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: WAYPOINT_COLORS.pickup }} />
            Pickup
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: WAYPOINT_COLORS.stop }} />
            Stops (in order)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: WAYPOINT_COLORS.destination }} />
            Destination
          </span>
        </div>
      )}
    </div>
  );
}
