"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { UserData } from "@/types";

// Roles allowed to see the audit logs: super admins and admin staff.
const AUDIT_LOG_ROLES = ["super_admin", "super-admin", "superadmin", "admin"];

// The stored login role is not reliable (it's hard-coded at sign-in), so read
// the real role from the signed-in user's profile.
const getRoles = (user?: UserData) => {
  const userType = user?.user_type as
    | { value?: string; type_id?: { role?: string } | string }
    | undefined;
  const typeRole =
    typeof userType?.type_id === "object" ? userType.type_id?.role : undefined;
  return [userType?.value, typeRole]
    .filter((r): r is string => !!r)
    .map((r) => r.toLowerCase());
};

export function useCanViewAuditLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    retry: false,
    queryFn: () => getUser(),
  });

  const roles = getRoles(data?.user);
  return {
    isLoading,
    allowed: roles.some((r) => AUDIT_LOG_ROLES.includes(r)),
    roles,
  };
}
