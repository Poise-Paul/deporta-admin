"use client";

import { RouteDetails } from "@/components/shared/route-details";
import { useRouter } from "next/navigation";

export default function StaffManagementPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <RouteDetails onBack={() => router.back()} />
    </div>
  );
}
