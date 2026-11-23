import type { LatLng, MapWaypoint } from "@/components/buses/bus-live-map";

// A route point as the API sends it. Trip routes carry their points as
// `{ value, location: { coordinates } }` (the shape both mobile apps read),
// while bus-stop records use a top-level `coordinates`. Both are GeoJSON
// order: [longitude, latitude].
type RoutePoint = {
  value?: string;
  coordinates?: number[];
  location?: { coordinates?: number[] };
};

export const toLatLng = (point?: RoutePoint | null): LatLng | null => {
  const coords = point?.location?.coordinates ?? point?.coordinates;
  if (!coords || coords.length !== 2) return null;
  const [lng, lat] = coords;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  // [0, 0] is the "nothing picked yet" placeholder, not a real place.
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
};

type TripLike = {
  starting_point?: RoutePoint;
  destination?: RoutePoint;
  number_of_stops?: RoutePoint[];
};

// Pickup, every stop (in order) and destination of a trip route.
export const tripWaypoints = (trip?: TripLike | null): MapWaypoint[] => {
  if (!trip) return [];
  const points: (MapWaypoint | null)[] = [];
  const add = (point: RoutePoint | undefined, kind: MapWaypoint["kind"]) => {
    const position = toLatLng(point);
    points.push(position ? { position, label: point?.value ?? "", kind } : null);
  };
  add(trip.starting_point, "pickup");
  (trip.number_of_stops ?? []).forEach((stop) => add(stop, "stop"));
  add(trip.destination, "destination");
  return points.filter((w): w is MapWaypoint => w !== null);
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

export const distanceMeters = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// Compass bearing (0 = north, 90 = east) from a to b.
export const bearingDegrees = (a: LatLng, b: LatLng) => {
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};
