"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics";
import { DashboardCustomers } from "@/components/dashboard/dashboard-customers";
import { DashboardOngoingTrips } from "@/components/dashboard/dashboard-ongoing-trips";
import { DashboardDrivers } from "@/components/dashboard/dashboard-drivers";
import { Toaster } from "react-hot-toast";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome Back, Boss <span className="text-2xl">👋</span>
        </h2>
        <p className="text-muted-foreground">
          Deporta Transport Unit Success Starts Here. View Analytics, Drivers,
          Locations and more!
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Analytics Chart - Takes 2 columns */}
        <div className="xl:col-span-2">
          <DashboardAnalytics />
        </div>

        {/* Ongoing Trips - Takes 1 column */}
        <div>
          <DashboardOngoingTrips />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customers Table - Takes 2 columns */}
        <div className="xl:col-span-2">
          <DashboardCustomers />
        </div>

        {/* Drivers on Site - Takes 1 column */}
        <div>
          <DashboardDrivers />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
