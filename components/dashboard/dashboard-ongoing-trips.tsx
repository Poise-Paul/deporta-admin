import { getOngoingTrips } from "@/api/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateETA } from "@/utils/timeConvert";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

export function DashboardOngoingTrips() {
  const { data: ongoingTrips } = useQuery({
    queryKey: ["ongoingTotal"],
    queryFn: () => getOngoingTrips(),
  });

  return (
    <Card className="bg-card border border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ongoing Trips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ongoingTrips?.trip_route.data.map((trip) => (
          <div
            key={trip._id}
            className="p-3 rounded-lg border border-border bg-background"
          >
            <div className="flex items-start gap-3">
              <img
                src={trip.busImage || "/placeholder.svg"}
                alt="Bus"
                className="w-16 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Pickup Location</span>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    {trip.code}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">
                  {trip.starting_point.value}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-primary">
                  <Clock className="h-3 w-3" />
                  <span>{trip.pickupTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3 text-destructive" />
                  <span>{trip.destination.value}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{calculateETA(Number(trip.route_distance))}</span>
                <Users className="h-3 w-3" />
                <span>{trip.passengers}</span>
              </div>
            </div>
          </div>
        ))}

        <Link
          href="/trips"
          className="block text-center text-sm text-primary hover:underline py-2"
        >
          View All Ongoing Trips
        </Link>
      </CardContent>
    </Card>
  );
}
