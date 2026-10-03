"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Lock, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAuditLogs } from "@/api/audit-logs";
import { AuditLogUser } from "@/types";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "support", label: "Support" },
  { value: "developer", label: "Developer" },
  { value: "customer-rep", label: "Customer-Rep" },
  { value: "maintenance", label: "Maintenance" },
];

const METHOD_STYLES: Record<string, string> = {
  GET: "border-blue-500 text-blue-600 bg-blue-50",
  POST: "border-green-500 text-green-600 bg-green-50",
  PATCH: "border-orange-500 text-orange-600 bg-orange-50",
  PUT: "border-orange-500 text-orange-600 bg-orange-50",
  DELETE: "border-red-500 text-red-600 bg-red-50",
};

// Debounce free-text filters so we don't query on every keystroke.
function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Date input (yyyy-mm-dd, local) -> ISO at the start or end of that day.
const toIsoDay = (date: string, endOfDay: boolean) => {
  if (!date) return undefined;
  const [y, m, d] = date.split("-").map(Number);
  const local = endOfDay
    ? new Date(y, m - 1, d, 23, 59, 59, 999)
    : new Date(y, m - 1, d, 0, 0, 0, 0);
  return local.toISOString();
};

// Page numbers to show, with gaps collapsed: 1 … 4 5 6 … 20
const pageWindow = (current: number, total: number): (number | "gap")[] => {
  const pages = new Set(
    [1, total, current - 1, current, current + 1].filter(
      (p) => p >= 1 && p <= total,
    ),
  );
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
};

export function AuditLogsTable() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("");
  const [role, setRole] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedUser, setSelectedUser] = useState<AuditLogUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const debouncedName = useDebounced(name);
  const debouncedEmail = useDebounced(email);
  const debouncedAction = useDebounced(action);

  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    name: debouncedName,
    email: debouncedEmail,
    action: debouncedAction,
    role,
    date_from: toIsoDay(dateFrom, false),
    date_to: toIsoDay(dateTo, true),
    user_id: selectedUser?._id,
  };

  // Any filter change goes back to the first page.
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedName,
    debouncedEmail,
    debouncedAction,
    role,
    dateFrom,
    dateTo,
    selectedUser,
    itemsPerPage,
  ]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const logs = data?.data.data ?? [];
  const totalPages = data?.data.pagination.totalPages || 1;
  const totalCount = data?.data.pagination.count ?? 0;

  const hasFilters =
    !!name ||
    !!email ||
    !!action ||
    role !== "all" ||
    !!dateFrom ||
    !!dateTo ||
    !!selectedUser;

  const clearFilters = () => {
    setName("");
    setEmail("");
    setAction("");
    setRole("all");
    setDateFrom("");
    setDateTo("");
    setSelectedUser(null);
  };

  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 401 || status === 403) {
    return <AuditLogsLocked />;
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Audit Logs</h2>
            <p className="text-sm text-muted-foreground">
              Every action admins and staff take on the portal.
            </p>
          </div>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="First or last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 bg-transparent"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Action</Label>
            <Input
              placeholder="e.g. Added staff"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="bg-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full bg-transparent">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent"
            />
          </div>
        </div>

        {selectedUser && (
          <div>
            <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
              Showing actions by {selectedUser.first_name}{" "}
              {selectedUser.last_name}
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="ml-1 hover:bg-destructive hover:text-white rounded-full p-0.5"
                aria-label="Clear user filter"
              >
                <X size={12} />
              </button>
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          {isFetching && !isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10" />
          )}
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Date & Time",
                  "User",
                  "Role",
                  "Action",
                  "Method",
                  "Endpoint",
                  "IP Address",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    {error
                      ? "Couldn't load audit logs. Please try again."
                      : hasFilters
                        ? "No audit logs match these filters."
                        : "No audit logs yet."}
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const user = log.user_id;
                  const date = new Date(log.createdAt);
                  return (
                    <tr
                      key={log._id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-4 text-sm whitespace-nowrap">
                        <p>{date.toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {date.toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="p-4">
                        {user ? (
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            title="Show only this user's actions"
                            className="flex items-center gap-3 text-left"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.profile_image || "/placeholder.svg"}
                                alt={user.first_name}
                              />
                              <AvatarFallback>
                                {user.first_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0">
                              <span className="block font-medium text-sm hover:underline">
                                {user.first_name} {user.last_name}
                              </span>
                              <span className="block text-xs text-muted-foreground truncate">
                                {user.email}
                              </span>
                            </span>
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Deleted user
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground capitalize">
                        {log.role}
                      </td>
                      <td className="p-4 text-sm font-medium">{log.action}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono text-[10px]",
                            METHOD_STYLES[log.method?.toUpperCase()] ?? "",
                          )}
                        >
                          {log.method}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <code className="text-xs text-muted-foreground break-all">
                          {log.endpoint}
                        </code>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {log.ip_address}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-sm bg-background"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            per page
            <span className="ml-2">· {totalCount} total</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {"<"}
            </Button>
            {pageWindow(currentPage, totalPages).map((p, i) =>
              p === "gap" ? (
                <span
                  key={`gap-${i}`}
                  className="px-1 text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    currentPage === p
                      ? "bg-[#0A1942] text-white hover:bg-[#0A1942]/90"
                      : "text-muted-foreground",
                  )}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ),
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {">"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AuditLogsLocked() {
  return (
    <Card className="bg-card border border-border">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold">Audit Logs are locked</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Only super admins and admin staff can view the audit logs.
        </p>
      </CardContent>
    </Card>
  );
}
