import { AuditLogFilters, AuditLogsResponse } from "@/types";
import { api } from "../axios";

export const getAuditLogs = async (
  filters: AuditLogFilters,
): Promise<AuditLogsResponse> => {
  const params = new URLSearchParams({
    page: filters.page.toString(),
    limit: filters.limit.toString(),
  });

  // Only send filters that are actually set.
  const optional: (keyof AuditLogFilters)[] = [
    "user_id",
    "role",
    "action",
    "date_from",
    "date_to",
    "name",
    "email",
  ];
  optional.forEach((key) => {
    const value = filters[key];
    if (typeof value === "string" && value.trim() && value !== "all") {
      params.append(key, value.trim());
    }
  });

  try {
    const res = await api.get(`/api/users/admin/audit-logs/?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch Audit Logs Error:", error);
    throw error;
  }
};
