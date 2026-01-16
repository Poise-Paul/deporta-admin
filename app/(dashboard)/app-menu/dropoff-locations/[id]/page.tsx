"use client";

import { DropOffStationDetail } from "@/components/shared/drop-off-detail";
import { PickupStationDetail } from "@/components/shared/pickup-station-detail";
import { useRouter } from "next/navigation";

export default function StaffManagementPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <DropOffStationDetail onBack={() => router.back()} />
    </div>
  );
}
