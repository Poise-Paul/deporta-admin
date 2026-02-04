"use client";

import { DriverDetails } from "@/components/drivers/driver-details";
import { useRouter } from "next/navigation";

export default function DriverDetailPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <DriverDetails onBack={() => router.back()} />
    </div>
  );
}