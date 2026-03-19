import { getDashboardTotal } from "@/api/dashboard";
import { getOngoingTrips } from "@/api/routes";
import { getAllStaffs } from "@/api/staffs";
import { getAllCustomers } from "@/api/user";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Wallet, Users, MapPin, Bus } from "lucide-react";

export function DashboardStats() {
  const { data: adminData } = useQuery({
    queryKey: ["staffDashboard"],
    queryFn: () => getAllStaffs(),
  });

  const { data: adminTotal } = useQuery({
    queryKey: ["adminTotal"],
    queryFn: () => getDashboardTotal(),
  });

  const { data: customertData } = useQuery({
    queryKey: ["customerDashboard"],
    queryFn: () => getAllCustomers(),
  });

  const { data: ongoingTrips } = useQuery({
    queryKey: ["ongoingTotal"],
    queryFn: () => getOngoingTrips(),
  });

  const stats = [
    {
      title: "Total made today",
      value: `₦ ${adminTotal?.income[0].amount.toLocaleString() || 0}`,
      icon: Wallet,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Total Staffs",
      value: adminData?.staffs ? adminData?.staffs[0].count : "0",
      icon: Users,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Ongoing Trips",
      value: ongoingTrips?.trip_route
        ? ongoingTrips?.trip_route.data.length
        : 0,
      icon: MapPin,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Customers on the app",
      value: customertData?.customers ? customertData?.customers[0].count : "0",
      icon: Bus,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <button className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">
                View details
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
