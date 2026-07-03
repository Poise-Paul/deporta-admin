"use client";

import CorporateDetailsPage from "@/components/co-operate/co-operate-details";
import { Toaster } from "react-hot-toast";

export default function CoperateDetailPage() {
  return (
    <div className="space-y-6">
      <Toaster />
      <CorporateDetailsPage />
    </div>
  );
}
