"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "../ui/back-button";
import { useRouter } from "next/navigation";

export function TripDetailView() {
  const trip = {
    id: 5,
    busImage: "/transport-bus-black.jpg",
    pickupLocation: "Sangotedo, Shoprite",
    destination: "Marina, CMS",
    journeyCode: "DEPO 94-T18",
    pickupTime: "08:00 AM",
    duration: "60 Mins",
    passengers: 20,
  };
  const router = useRouter();
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <BackButton onClick={() => router.back()} label="All Ongoing Trips" />

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{trip.journeyCode}</h2>
          <p className="text-muted-foreground">Started at {trip.pickupTime}</p>
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
                <div>
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary" />
                  <p className="font-bold">{trip.pickupLocation}</p>
                  <p className="text-xs text-muted-foreground">
                    Departed 10:30 AM
                  </p>
                </div>
                <div>
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-gray-300" />
                  <p className="font-bold">{trip.destination}</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated Arrival: 2:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Driver & Bus Info */}
        <div className="space-y-4">
          <Card className="bg-orange-50/50 border-orange-100">
            <CardHeader>
              <CardTitle className="text-sm">Assigned Driver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-200" />
                <div>
                  <p className="text-sm font-bold">John Doe</p>
                  <p className="text-xs">+234 812 345 6789</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold">Toyota Coaster</p>
              <p className="text-xs text-muted-foreground">Plate: APP-123-XY</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
