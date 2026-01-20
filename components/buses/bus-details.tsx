"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getStaffList } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

interface BusDetailsProps {
  busId: string;
}

export function BusDetails({ busId }: BusDetailsProps) {
  const { selBus } = useSelector((state: RootState) => state.bus);

  const { data: staffData, refetch: refetchStaffs } = useQuery({
    queryKey: ["staffs"],
    retry: false,
    queryFn: () => getStaffList(),
  });
  // In a real app, this would fetch bus data based on busId
  const bus = {
    id: busId,
    name: "Island Runner",
    dateAssigned: "05/05/2025",
    status: "Active",
    route: "AJUB - OSBR",
    capacity: 20,
    driver: {
      name: "Jejelola Rotimi",
      avatar: "/african-driver-man.jpg",
    },
    scheduledMaintenance: "14/12/2025 (Tuesday)",
    images: [
      "/transport-bus-black.jpg",
      "/passenger-bus.jpg",
      "/shuttle-bus.png",
      "/transport-bus-black.jpg",
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Section - Bus Info */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Bus Image */}
            <div className="shrink-0">
              <img
                src={selBus?.bus_photo}
                alt={selBus?.name_label}
                className="w-full md:w-64 h-40 rounded-lg object-cover"
              />
            </div>

            {/* Driver Info */}
            {selBus && (
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex -space-x-2">
                  {selBus.drivers_assigned?.length > 0
                    ? selBus.drivers_assigned.map((routeId, key) => {
                        const driver = staffData?.staffs.data.find(
                          (r) =>
                            r.user_type.type_id.role === "driver" &&
                            r._id === routeId
                        );
                        return (
                          <Avatar className="h-12 w-12 border-2 border-card">
                            <AvatarImage src={driver?.profile_image} />
                            <AvatarFallback>{`U${key}`}</AvatarFallback>
                          </Avatar>
                        );
                      })
                    : null}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">
                    Driver Assigned
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {selBus.drivers_assigned?.length > 0
                      ? selBus.drivers_assigned.map((routeId) => {
                          const driver = staffData?.staffs.data.find(
                            (r) =>
                              r.user_type.type_id.role === "driver" &&
                              r._id === routeId
                          );
                          return (
                            <Badge
                              key={routeId}
                              variant="outline"
                              className="text-[10px] px-1"
                            >
                              {driver
                                ? `${driver.first_name} ${driver.last_name}`
                                : routeId}
                            </Badge>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            )}

            {/* Update Button */}
            <div className="md:ml-auto">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Update Bus
              </Button>
            </div>
          </div>

          {/* Bus Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-muted-foreground">Bus ID/ Code</p>
              <p className="font-semibold text-sm">{selBus?.id_code}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bus Name</p>
              <p className="font-semibold text-sm">{bus.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date Assigned</p>
              <p className="font-semibold text-sm">{bus.dateAssigned}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className="border-green-500 text-green-600 bg-green-50 font-normal"
              >
                {bus.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Route(s) Assigned</p>
              <p className="font-semibold text-sm">{bus.route}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-semibold text-sm">{bus.capacity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Driver Assigned</p>
              <p className="font-semibold text-sm">{bus.driver.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Scheduled Maintenance
              </p>
              <p className="font-semibold text-sm">
                {bus.scheduledMaintenance}
              </p>
            </div>
          </div>

          {/* Car Images */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Car Images{" "}
              <span className="text-xs">
                (click car images to open them bigger)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {bus.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Bus image ${index + 1}`}
                  className="w-full h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Section - Map */}
      <Card className="bg-card border border-border">
        <CardContent className="p-0 h-full min-h-[400px]">
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <img
              src="/lagos-map-with-route-markers-and-bus-stops.jpg"
              alt="Route Map"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
