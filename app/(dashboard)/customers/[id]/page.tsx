"use client";

import { CustomerDetails } from "@/components/customers/customer-details";
import { useRouter } from "next/navigation";

export default function CustomerDetailPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <CustomerDetails onBack={() => router.back()} />
    </div>
  );
}
