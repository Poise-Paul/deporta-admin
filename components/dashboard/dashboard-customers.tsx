"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCustomerList } from "@/api/user";
import { useStaffStatus } from "@/api/dashboard";
import { UpdateStaff } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelCustomer } from "@/lib/store/slices/customer-slice";
import { Skeleton } from "../ui/skeleton";

export function DashboardCustomers() {
  // Get All Users
  const {
    data,
    error: userError,
    refetch: refetchCustomers,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ["customers"],
    retry: false,
    queryFn: () => getCustomerList(),
  });

  const updateMutation = useStaffStatus();

  const handleUpdateCustomer = (data: UpdateStaff) => {
    updateMutation.mutate(data, {
      onSuccess: () => refetchCustomers(),
    });
  };
  const router = useRouter();
  const dispatch = useDispatch();

  const TableRowSkeleton = () => (
    <tr className="border-b border-border animate-pulse">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-8 rounded-md" />
      </td>
    </tr>
  );

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Email Address
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Date Joined
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : (
                data?.staffs.data.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={customer.profile_image || "/placeholder.svg"}
                            alt={customer.first_name}
                          />
                          <AvatarFallback>
                            {customer.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {customer.first_name} {customer.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {customer.email}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {customer.phone_number}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          customer.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50",
                        )}
                      >
                        {customer.status === "active" ? "Active" : "In-active"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              // 1. Prevent the dropdown from closing
                              e.preventDefault();
                              handleUpdateCustomer({
                                status:
                                  customer.status === "active"
                                    ? "in-active"
                                    : "active",
                                user_id: customer._id,
                              });
                            }}
                            className={
                              customer.status === "active"
                                ? "text-destructive"
                                : "text-success"
                            }
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            {customer.status === "active"
                              ? "De-activate"
                              : "Re-Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              dispatch(updateSelCustomer(customer));
                              router.push(`/customers/${customer._id}`);
                            }}
                          >
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
