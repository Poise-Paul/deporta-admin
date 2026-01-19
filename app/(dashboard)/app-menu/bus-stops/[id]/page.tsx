"use client";

import { BusStopDetail } from "@/components/bus-stops/bus-stop-details";
import { DropOffStationDetail } from "@/components/shared/drop-off-detail";
import { useRouter } from "next/navigation";

export default function StaffManagementPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <BusStopDetail onBack={() => router.back()} />
    </div>
  );
}
