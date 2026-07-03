"use client";

import { CooperateTable } from "@/components/co-operate/cooperate-accounts";
import { Toaster } from "react-hot-toast";

export default function DriverOutsourcingPage() {
  return (
    <div className="space-y-6">
      <Toaster />
      <CooperateTable />
    </div>
  );
}
