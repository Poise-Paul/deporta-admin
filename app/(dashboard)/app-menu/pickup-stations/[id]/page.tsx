"use client";

import { PickupStationDetail } from "@/components/shared/pickup-station-detail";
import { useRouter } from "next/navigation";

export default function StaffManagementPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <PickupStationDetail onBack={() => router.back()} />
    </div>
  );
}
