"use client";

import { StaffDetailPage } from "@/components/staff/staff-details";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function StaffManagementPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <StaffDetailPage onBack={() => router.back()} />
    </div>
  );
}
