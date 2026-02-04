"use client";

import {
  getAllCustomers,
  getAllDrivers,
  getOnsiteDrivers,
  getTotalUsers,
} from "@/api/user";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";

export function UserManagementStats() {
  const { data: driverData } = useQuery({
    queryKey: ["driverDashboard"],
    queryFn: () => getAllDrivers(),
  });

  const { data: customerData } = useQuery({
    queryKey: ["customerDashboard"],
    queryFn: () => getAllCustomers(),
  });

  const { data: onsiteData } = useQuery({
    queryKey: ["onsiteDashboard"],
    queryFn: () => getOnsiteDrivers(),
  });

  const { data: totalUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getTotalUsers(),
  });

  const stats = [
    {
      title: "Total users today",
      value: totalUsers?.users[0].count || 0,
      change: "+18.2%",
      borderColor: "border-l-primary",
    },
    {
      title: "Total drivers today",
      value:
        driverData?.staffs && driverData?.staffs.length > 0
          ? driverData?.staffs[0].count
          : "0",
      change: "+18.2%",
      borderColor: "border-l-secondary",
    },
    {
      title: "Total customers today",
      value: customerData?.customers ? customerData?.customers[0].count : "0",
      change: "+18.2%",
      borderColor: "border-l-pink-500",
    },
    {
      title: "Total drivers on site",
      value:
        onsiteData?.staffs && onsiteData?.staffs.length > 0
          ? onsiteData?.staffs[0].count
          : "0",
      change: "+18.2%",
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
              {stat.title.split(" ").slice(0, 2).join(" ")}
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
