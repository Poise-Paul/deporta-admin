"use client";

import { getTotalBooking, getTotalIncome } from "@/api/bookings";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";

export function VehicleRentalsStats() {
  const { data: allBookings } = useQuery({
    queryKey: ["totalBookings"],
    queryFn: () => getTotalBooking(),
  });

  const { data: allIncome } = useQuery({
    queryKey: ["totalIncome"],
    queryFn: () => getTotalIncome(),
  });

  const stats = [
    {
      title: "Total amount made",
      value: allIncome?.booking[0].amount || 0,
      change: "+18.2%",
      borderColor: "border-l-primary",
    },
    {
      title: "Total rentals made",
      value: allBookings?.booking[0].count,
      change: "+18.2%",
      borderColor: "border-l-secondary",
    },
    {
      title: "Rentals",
      value: "72",
      change: "+18.2%",
      label: "Active",
      borderColor: "border-l-pink-500",
    },
    {
      title: "Buses on rentals",
      value: "18",
      change: "+18.2%",
      label: "Overdue Rentals",
      borderColor: "border-l-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`bg-card border border-border border-l-4 ${stat.borderColor}`}
        >
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground">
              {stat.label || stat.title.split(" ").slice(0, 2).join(" ")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                {stat.change}
                <TrendingUp className="h-3 w-3" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
