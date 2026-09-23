"use client";

import { useEffect, useState } from "react";
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

interface BusLiveMapProps {
  // Current bus position. Once the tracking socket is available, feed live
  // updates into this prop and the marker/map will follow.
  position: LatLng;
  label?: string;
  lastUpdated?: string;
  // Optional route points (e.g. a trip's pickup, stops and destination).
  // When given, the map frames the whole route instead of following the bus.
  waypoints?: MapWaypoint[];
}

const containerStyle = { width: "100%", height: "100%", minHeight: 400 };

export function BusLiveMap({
  position,
  label,
  lastUpdated,
  waypoints,
}: BusLiveMapProps) {
  // The Maps script is loaded globally in app/layout.tsx.
  const [isLoaded, setIsLoaded] = useState(
    () => typeof window !== "undefined" && !!window.google?.maps,
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(true);

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

  // Frame the full route once the map and route points are ready.
  useEffect(() => {
    if (!map || !hasWaypoints) return;
    const bounds = new google.maps.LatLngBounds();
    waypoints!.forEach((w) => bounds.extend(w.position));
    bounds.extend(position);
    map.fitBounds(bounds, 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, hasWaypoints]);

  // Without a route to frame, keep the bus in view as its position changes.
  useEffect(() => {
    if (!hasWaypoints) map?.panTo(position);
  }, [map, hasWaypoints, position.lat, position.lng]);

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
        center={position}
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
        <MarkerF
          position={position}
          title={label}
          zIndex={2}
          onClick={() => setShowInfo(true)}
          icon={{
            url: "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#0f172a" stroke="#fff" stroke-width="3"/><g transform="translate(10 10)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></g></svg>`,
              ),
            scaledSize: new google.maps.Size(44, 44),
            anchor: new google.maps.Point(22, 22),
          }}
        >
          {showInfo && label && (
            <InfoWindowF
              position={position}
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="text-xs">
                <p className="font-semibold">{label}</p>
                <p>
                  {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                </p>
                {lastUpdated && (
                  <p className="text-gray-500">
                    Updated {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      </GoogleMap>
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Live location
      </div>
    </div>
  );
}
