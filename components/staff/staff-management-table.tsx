"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus, MoreVertical, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddStaffPayload, StaffData } from "@/types";
import { useForm } from "react-hook-form";
import { useCreateAdmin, useCreateStaff } from "@/api/staffs";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "@/api/user";
import { queryClient } from "@/api/queryClient";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelStaff } from "@/lib/store/slices/staff-slice";

type StaffTab = "all" | "active" | "inactive";

const tabs: { id: StaffTab; label: string }[] = [
  { id: "all", label: "All Staffs" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "In-Active" },
];

export function StaffManagementTable() {
  const [activeTab, setActiveTab] = useState<StaffTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [staffLoading, setStaffLoading] = useState(false);

  // get the current user
  const {
    data: staffData,
    error: staffError,
    refetch: refetchStaffs,
    isRefetching,
    isLoading: staffLoader,
  } = useQuery({
    queryKey: ["staffs"],
    retry: false,
    queryFn: () => getStaffList(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddStaffPayload>();

  const [selectedRole, setSelectedRole] = useState<string>("");

  const [holdBtn, setHoldBtn] = useState(true);

  const filteredStaff = React.useMemo(() => {
    const allStaff = staffData?.staffs?.data || [];

    if (activeTab === "active") {
      return allStaff.filter(
        (staff) => staff.user_type?.type_id?.status === "active"
      );
    }
    if (activeTab === "inactive") {
      return allStaff.filter(
        (staff) => staff.user_type?.type_id?.status === "inactive"
      );
    }
    return allStaff;
  }, [staffData, activeTab]);
  const handleWatch = watch();

  const { first_name, last_name, phone_number, email, otp, role, gender } =
    handleWatch;

  const createAdminMutation = useCreateAdmin();

  const createStaffMutation = useCreateStaff();

  const handleAdminStaff = () => {
    setStaffLoading(true);

    if (selectedRole === "admin") {
      createAdminMutation.mutate(
        {
          first_name,
          last_name,
          phone_number,
          email,
          gender,
          otp: otp ? otp : "",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staffs"] });
            setIsAddDialogOpen(false);
          },
          onSettled: () => {
            setStaffLoading(false);
          },
        }
      );
    } else {
      createStaffMutation.mutate(
        {
          first_name,
          last_name,
          phone_number,
          email,
          gender,
          role: selectedRole === "staff_admin" ? "admin" : selectedRole,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staffs"] });
            setIsAddDialogOpen(false);
          },
          onSettled: () => {
            setStaffLoading(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    const baseFieldsValid =
      first_name && last_name && phone_number && email && gender;
    let isRoleStepValid = false;

    if (selectedRole === "admin") {
      isRoleStepValid = !!otp;
    } else {
      isRoleStepValid = !!selectedRole;
    }
    if (baseFieldsValid && isRoleStepValid) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [
    first_name,
    last_name,
    phone_number,
    email,
    otp,
    selectedRole,
    gender,
    role,
  ]);

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

  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <Card className="bg-card border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Staff By Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-transparent"
            />
          </div>

          {/* Tabs and Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    activeTab === tab.id
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="icon" className="bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Add New {selectedRole === "admin" ? "Admin" : "Staff"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      {...register("first_name")}
                      id="name"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Last Name</Label>
                    <Input
                      {...register("last_name")}
                      id="name"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      {...register("phone_number")}
                      id="phone"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Gender</Label>
                    <div className="flex gap-4">
                      {/* Male Option */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="male"
                          value="Male"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          {...register("gender")}
                        />
                        <Label
                          htmlFor="male"
                          className="font-normal cursor-pointer"
                        >
                          Male
                        </Label>
                      </div>

                      {/* Female Option */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="female"
                          value="Female"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          {...register("gender")}
                        />
                        <Label
                          htmlFor="female"
                          className="font-normal cursor-pointer"
                        >
                          Female
                        </Label>
                      </div>
                    </div>

                    {errors.gender && (
                      <p className="text-sm text-destructive">
                        {errors.gender.message as string}
                      </p>
                    )}
                  </div>
                  {selectedRole === "admin" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">OTP Code</Label>
                      <Input
                        id="otp"
                        {...register("otp")}
                        placeholder="Enter OTP Code"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => setSelectedRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Super Admin Staff</SelectItem>
                        <SelectItem value="support">Support Staff</SelectItem>
                        <SelectItem value="staff_admin">Staff Admin</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="customer-rep">
                          Customer Rep Staff
                        </SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="maintenance">
                          Maintenance Staff
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    disabled={staffLoading}
                    onClick={handleAdminStaff}
                    className={`w-full bg-primary ${
                      holdBtn || staffLoading ? "opacity-30" : ""
                    } hover:bg-primary/90 text-primary-foreground`}
                  >
                    {staffLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Add Staff"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-3 border-b border-border">
          <CardTitle className="text-base font-semibold">All Staffs</CardTitle>
        </div>

        <div className="overflow-x-auto">
          {isRefetching && !staffLoader && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10" />
          )}
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Role
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {staffLoader ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : (
                filteredStaff?.map((staff) => (
                  <tr
                    key={staff._id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={staff.profile_image || "/placeholder.svg"}
                            alt={staff.first_name}
                          />
                          <AvatarFallback>
                            {staff.first_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {staff.first_name} {staff.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {staff.user_type.type_id.role}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {staff.email}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {staff.phone_number}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(staff.createdAt).toDateString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          staff.user_type.type_id.status === "active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-orange-500 text-orange-600 bg-orange-50"
                        )}
                      >
                        {staff.user_type.type_id.status === "active"
                          ? "Active"
                          : "In-active"}
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
                            onClick={() => {
                              dispatch(updateSelStaff(staff));
                              router.push(`/staff/${staff._id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {staff.user_type.type_id.status === "active"
                              ? "De-activate"
                              : "Activate"}
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

        {/* Additional Info - If Needed */}
        {/* <div className="px-6 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">Maintenance Staff</p>
        </div> */}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select className="border border-border rounded px-2 py-1 text-sm bg-background">
              <option>of 8</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 - Page</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                {"<"}
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                2
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <Toaster />
    </Card>
  );
}
