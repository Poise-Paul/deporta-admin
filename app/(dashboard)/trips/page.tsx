"use client";

import { MapPin, Clock, Users, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Trip } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

interface OngoingTripsProps {
  trips: Trip[]; // Define that 'trips' is an array of Trip objects
}

export default function OngoingTripsScreen() {
  const trips = [
    {
      id: 1,
      busImage: "/transport-bus-black.jpg",
      pickupLocation: "Ajah Under Bridge",
      destination: "Lekki First Gate",
      journeyCode: "DEPO 96-185",
      pickupTime: "06:00 AM",
      duration: "45 Mins",
      passengers: 20,
    },
    {
      id: 2,
      busImage: "/passenger-bus.jpg",
      pickupLocation: "Sangotedo, Shoprite",
      destination: "Marina, CMS",
      journeyCode: "DEPO 94-T18",
      pickupTime: "08:00 AM",
      duration: "60 Mins",
      passengers: 20,
    },
    {
      id: 3,
      busImage: "/shuttle-bus.png",
      pickupLocation: "Sangotedo, Shoprite",
      destination: "Marina, CMS",
      journeyCode: "DEPO 94-T18",
      pickupTime: "08:00 AM",
      duration: "60 Mins",
      passengers: 20,
    },
    {
      id: 4,
      busImage: "/passenger-bus.jpg",
      pickupLocation: "Co-Operative, Badore",
      destination: "Igbara, Jakande",
      journeyCode: "DEPO 98-T19",
      pickupTime: "08:00 AM",
      duration: "60 Mins",
      passengers: 20,
    },
    {
      id: 5,
      busImage: "/transport-bus-black.jpg",
      pickupLocation: "Sangotedo, Shoprite",
      destination: "Marina, CMS",
      journeyCode: "DEPO 94-T18",
      pickupTime: "08:00 AM",
      duration: "60 Mins",
      passengers: 20,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // Filter logic: match code or location
  const filteredTrips = trips.filter(
    (trip) =>
      trip.journeyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-10">
      {/* Header with Search */}
      <BackButton onClick={() => router.back()} label="Dashboard" />

      <div className="bg-white mt-5 p-4 border-b sticky top-0 z-10">
        <h1 className="text-xl font-bold mb-4">Ongoing Trips</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trip code or location..."
            className="pl-9 bg-gray-50"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Trips List */}
      <div className="p-4 space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="p-4 rounded-xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top Row: Trip Code & Status */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-600 rounded">
                {trip.journeyCode}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                Live Tracking
              </div>
            </div>

            {/* Middle Row: Visual Route */}
            <div className="flex items-start gap-4">
              <img
                src={trip.busImage || "/placeholder.svg"}
                alt="Bus"
                className="w-20 h-14 rounded-lg object-cover border border-gray-100"
              />

              <div className="flex-1 space-y-3">
                {/* Pickup */}
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-0.5 h-6 bg-gray-200" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground leading-none">
                      Pickup
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {trip.pickupLocation}
                    </p>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground leading-none">
                      Destination
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {trip.destination}
                    </p>
                  </div>
                </div>
              </div>

              <ChevronRight
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="h-5 w-5 text-gray-300 self-center"
              />
            </div>

            {/* Bottom Row: Stats Divider */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {trip.pickupTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {trip.passengers} pax
                </span>
              </div>
              <span className="font-medium text-gray-900">
                {trip.duration} remaining
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
