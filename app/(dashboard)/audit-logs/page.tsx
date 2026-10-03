"use client";

import {
  AuditLogsLocked,
  AuditLogsTable,
} from "@/components/audit-logs/audit-logs-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanViewAuditLogs } from "@/lib/permissions";

export default function AuditLogsPage() {
  const { allowed, isLoading } = useCanViewAuditLogs();

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : allowed ? (
        <AuditLogsTable />
      ) : (
        <AuditLogsLocked />
      )}
    </div>
  );
}
