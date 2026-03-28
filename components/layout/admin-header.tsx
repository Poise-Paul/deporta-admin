"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllStaffs } from "@/api/staffs";
import { getStaffList } from "@/api/user";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/staff": "Staff Management",
  "/app-menu/pickup-stations": "Pick up station",
  "/app-menu/dropoff-locations": "Drop Off Locations",
  "/app-menu/routes": "Routes",
  "/app-menu/bus-stops": "Bus-Stops",
  "/app-menu/drivers": "Drivers",
  "/app-menu/buses": "Buses",
  "/logistics/driver-outsourcing": "Driver Outsourcing",
  "/logistics/vehicle-rentals": "Vehicle Rentals",
  "/logistics/bookings": "Bookings",
  "/cms": "CMS",
  "/co-operate/accounts": "Co-Operate Accounts",
  "/co-operate/bookings": "Co-Operate Bookings",
  "/support": "Support Tools",
  "/settings": "Settings",
};

export function AdminHeader() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // Find the matching title, handling nested routes
  const title =
    Object.entries(pageTitles).find(
      ([path]) => pathname === path || pathname.startsWith(path + "/"),
    )?.[1] || "Dashboard";

  // Staff Images
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["staff-profiles"],
    retry: false,
    queryFn: () => getStaffList(),
  });

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Replace the Add Quick Staff Button */}
        <div className="flex -space-x-2">
          {data?.staffs.data.slice(0, 3).map((staff, key) => (
            <Avatar key={key} className="h-8 w-8 border-2 border-card">
              <AvatarImage src={staff.profile_image} />
              <AvatarFallback>S{key + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </header>
  );
}
