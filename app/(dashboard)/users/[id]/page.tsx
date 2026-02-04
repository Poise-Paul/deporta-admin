"use client";

import { UserDetails } from "@/components/users/user-details";
import { useRouter } from "next/navigation";

export default function CustomerDetailPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <UserDetails onBack={() => router.back()} />
    </div>
  );
}
