"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStatusUpdate } from "@/api/staffs";
import { ActiveType, StaffData } from "@/types";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useStaffStatus } from "@/api/dashboard";
import { updateSelCustomer } from "@/lib/store/slices/customer-slice";

// Assuming you pass the staff object as a prop or fetch it via ID
export function UserDetails({ onBack }: { onBack: () => void }) {
  const { customerDetails } = useSelector((state: RootState) => state.customer);

  const isActive = customerDetails?.status === "active";
  const currentStatus = customerDetails?.status;
  const statusMutation = useStaffStatus();
  const [btnUsed, setBtnUsed] = useState(1);

  const dispatch = useDispatch();
  // Usage
  const handleStatusChange = (btn: number) => {
    setBtnUsed(btn);
    statusMutation.mutate(
      {
        status:
          currentStatus === "active" ? ActiveType.InActive : ActiveType.Active,
        user_id: customerDetails?._id || "",
      },
      {
        onSuccess: () => {
          dispatch(
            updateSelCustomer({
              ...customerDetails,
              status:
                currentStatus === "active"
                  ? ActiveType.InActive
                  : ActiveType.Active,
            }),
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header / Back Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Users List
        </Button>
        <div className="flex gap-3">
          <Button
            variant={isActive ? "destructive" : "default"}
            disabled={statusMutation.isPending}
            onClick={() => handleStatusChange(1)}
            className={cn(!isActive && "bg-green-600 hover:bg-green-700")}
          >
            {statusMutation.isPending && btnUsed === 1 ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isActive ? (
              <XCircle className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            {isActive ? "De-activate Customer" : "Activate Customer"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <Card className="lg:col-span-1 border-border">
          <CardContent className="pt-8 pb-6 text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-muted">
              <AvatarImage src={customerDetails?.profile_image} />
              <AvatarFallback className="text-2xl">
                {customerDetails?.first_name[0]}
                {customerDetails?.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {customerDetails?.first_name} {customerDetails?.last_name}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {customerDetails?.user_type.value}
            </p>
            <Badge
              variant="outline"
              className={cn(
                "px-4 py-1",
                isActive
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-orange-500 text-orange-600 bg-orange-50",
              )}
            >
              {isActive ? "Active Account" : "Inactive Account"}
            </Badge>
          </CardContent>
          <Separator />
          {customerDetails && (
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.phone_number}</span>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Right Column: Detailed Info */}
        {customerDetails && (
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="First Name"
                  value={customerDetails?.first_name}
                  icon={<User />}
                />
                <InfoItem
                  label="Last Name"
                  value={customerDetails?.last_name}
                  icon={<User />}
                />
                {/* <InfoItem
                label="Gender"
                value={staff.gender || "Not Specified"}
                icon={<User />}
              /> */}
                <InfoItem
                  label="Joined Date"
                  value={new Date(
                    customerDetails.createdAt,
                  ).toLocaleDateString()}
                  icon={<Calendar />}
                />
                <InfoItem
                  label="System Role"
                  value={customerDetails.user_type.value}
                  icon={<Shield />}
                />
                <InfoItem
                  label="Email Verified"
                  value="Yes"
                  icon={<CheckCircle2 className="text-green-500" />}
                />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  De-activating this account will immediately revoke all access
                  to the Deporta Logistics Admin panels.
                </p>
                <Button
                  disabled={customerDetails.status === "active" ? false : true}
                  variant="outline"
                  onClick={() => handleStatusChange(2)}
                  className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {statusMutation.isPending && btnUsed === 2 && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  De-activate Customer Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm capitalize font-semibold">{value}</p>
      </div>
    </div>
  );
}
