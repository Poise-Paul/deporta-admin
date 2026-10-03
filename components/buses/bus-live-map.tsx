"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

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
  stop: "#9ca3af",
  destination: "#16a34a",
};

export interface LiveVehicle {
  id: string;
  position: LatLng;
  label: string;
  lastUpdated?: string;
}

interface BusLiveMapProps {
  // One pin per vehicle/driver. Feed live socket updates into this prop and
  // the pins move with them.
  vehicles: LiveVehicle[];
  // Optional route points (e.g. a trip's pickup, stops and destination).
  waypoints?: MapWaypoint[];
}

const containerStyle = { width: "100%", height: "100%", minHeight: 400 };

// Only look the address up again once the bus has moved this far, so live
// updates every few seconds don't trigger a geocode call each time.
const REGEOCODE_DISTANCE_M = 50;

const distanceMeters = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

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

const BUS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#0f172a" stroke="#fff" stroke-width="3"/><g transform="translate(10 10)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></g></svg>`;

function VehicleMarker({ vehicle }: { vehicle: LiveVehicle }) {
  const { position, label, lastUpdated } = vehicle;
  const [showInfo, setShowInfo] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const lastGeocodedRef = useRef<LatLng | null>(null);
  const geocodeRequestRef = useRef(0);

  // Reverse-geocode the position into a readable address.
  useEffect(() => {
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
  }, [position.lat, position.lng]);

  return (
    <MarkerF
      position={position}
      title={label}
      zIndex={2}
      onClick={() => setShowInfo(true)}
      icon={{
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(BUS_ICON_SVG),
        scaledSize: new google.maps.Size(44, 44),
        anchor: new google.maps.Point(22, 22),
      }}
    >
      {showInfo && (
        <InfoWindowF
          position={position}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="text-xs">
            <p className="font-semibold">{label}</p>
            {address && <p>{address}</p>}
            <p className="text-gray-500">
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
            {lastUpdated && (
              <p className="text-gray-500">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </InfoWindowF>
      )}
    </MarkerF>
  );
}

export function BusLiveMap({ vehicles, waypoints }: BusLiveMapProps) {
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

  const hasWaypoints = !!waypoints && waypoints.length > 0;
  const vehicleIdsKey = vehicles.map((v) => v.id).join(",");

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

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg bg-muted">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] overflow-hidden rounded-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={vehicles[0]?.position ?? waypoints?.[0]?.position}
        zoom={15}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {waypoints?.map((w, i) => (
          <MarkerF
            key={`${w.kind}-${i}`}
            position={w.position}
            title={w.label}
            zIndex={1}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: w.kind === "stop" ? 6 : 9,
              fillColor: WAYPOINT_COLORS[w.kind],
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        ))}
        {vehicles.map((v) => (
          <VehicleMarker key={v.id} vehicle={v} />
        ))}
      </GoogleMap>
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Live location
      </div>
    </div>
  );
}
