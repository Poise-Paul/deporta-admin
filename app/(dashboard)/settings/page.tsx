"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image, Loader2, Plus } from "lucide-react";
import { useCreateRequest, useUpdateAccount } from "@/api/staffs";
import { useForm } from "react-hook-form";
import { NewPasswordPayload, ProfileUpdate } from "@/types";
import { Toaster } from "react-hot-toast";
import { PasswordInput } from "@/components/ui/password-input";
import { useChangePassword } from "@/api/onboarding";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [holdPasswordBtn, setHoldPasswordBtn] = useState(true);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const [profoileLoader, setProfileLoader] = useState(false);
  const [holdProfile, setHoldProfile] = useState(true);

  // get the current user
  const {
    data: userData,
    error: userError,
    refetch: refetchUser,
    isLoading: userLoader,
  } = useQuery({
    queryKey: ["user"],
    retry: false,
    queryFn: () => getUser(),
  });

  const dobRaw = userData?.user?.date_of_birth;
  const dobFormatted = dobRaw ? format(new Date(dobRaw), "yyyy-MM-dd") : "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordPayload>({
    defaultValues: {
      email: userData?.user.email,
    },
  });

  const {
    register: profileRegister,
    handleSubmit: profileHandleSubmit,
    setValue,
    watch: profileWatch,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdate>({
    defaultValues: {
      imageUrl: userData?.user.profile_image, // string URL for display
      first_name: userData?.user.first_name,
      last_name: userData?.user.last_name,
      phone_number: userData?.user.phone_number,
      date_of_birth: dobFormatted,
    },
  });

  useEffect(() => {
    if (userData?.user?.date_of_birth) {
      const formatted = format(
        new Date(userData.user.date_of_birth),
        "yyyy-MM-dd"
      );
      setValue("date_of_birth", formatted);
      setValue("phone_number", userData.user.phone_number);
      setValue("first_name", userData.user.first_name);
      setValue("last_name", userData.user.last_name);
      setValue("imageUrl", userData.user.profile_image);
    }
  }, [userData, setValue]);

  const handleWatch = watch();
  const handleProfileWatch = profileWatch();
  const requestEditMutation = useCreateRequest();

  const changePasswordMutation = useChangePassword();

  const { email, otp, password, confirm_password } = handleWatch;

  const imageUrl = profileWatch("imageUrl");

  const handleRequestEdit = () => {
    setIsLoading(true);
    requestEditMutation.mutate(`${userData?.user.email}`, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      },
      onSettled: () => setIsLoading(false),
    });
  };

  const handleChangePassword = () => {
    setPasswordLoader(true);
    changePasswordMutation.mutate(
      {
        otp,
        email: `${userData?.user.email}`,
        password,
        confirm_password,
      },
      {
        onSettled: () => setPasswordLoader(false),
      }
    );
  };

  useEffect(() => {
    if (email && otp && password && confirm_password) {
      setHoldPasswordBtn(false);
    } else {
      setHoldPasswordBtn(true);
    }
  }, [email, otp, password, confirm_password]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file); // File for upload
      setValue("imageUrl", URL.createObjectURL(file)); // Preview URL for display
    }
  };

  const profileUpdateMutation = useUpdateAccount();

  const { first_name, last_name, phone_number, date_of_birth, image } =
    handleProfileWatch;

  const handleProfileUpdate = () => {
    setProfileLoader(true);
    profileUpdateMutation.mutate(
      {
        image,
        first_name,
        last_name,
        phone_number,
        date_of_birth,
      },
      {
        onSettled: () => setProfileLoader(false),
      }
    );
  };

  useEffect(() => {
    if (!userData?.user) return; // ⛔ skip until userData is ready

    const {
      first_name,
      last_name,
      phone_number,
      date_of_birth,
      profile_image,
    } = userData.user;

    const imageUrl = profile_image || ""; // fallback if needed

    const allFilled =
      !!first_name &&
      !!last_name &&
      !!phone_number &&
      !!date_of_birth &&
      !!imageUrl;

    setHoldProfile(!allFilled);
  }, [userData]);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Settings */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="w-20 h-20 rounded-full overflow-hidden border">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  className="object-cover"
                  src={imageUrl}
                  alt="profile_img"
                />
                <AvatarFallback>
                  {userData?.user?.first_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...profileRegister("first_name")}
                defaultValue={userData?.user?.first_name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...profileRegister("last_name")}
                defaultValue={userData?.user?.last_name}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              readOnly
              disabled
              defaultValue={userData?.user?.email}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone_number"
                {...profileRegister("phone_number")}
                defaultValue={userData?.user?.phone_number}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Of Birth</Label>
              <Input
                id="date"
                {...profileRegister("date_of_birth")}
                type="date"
                defaultValue={dobFormatted}
              />
            </div>
          </div>

          <Button
            onClick={handleProfileUpdate}
            className={`bg-primary ${
              holdProfile || profoileLoader ? "opacity-30" : ""
            } hover:bg-primary/90 text-primary-foreground`}
          >
            {profoileLoader ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Request OTP
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Password OTP</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Enter Email Address</Label>
                    <Input
                      type="email"
                      defaultValue={userData?.user.email}
                      {...register("email")}
                      id="email"
                      placeholder="Enter your mail"
                    />
                  </div>

                  <Button
                    disabled={isLoading}
                    onClick={handleRequestEdit}
                    className={`w-full bg-primary ${
                      isLoading ? "opacity-30" : ""
                    } hover:bg-primary/90 text-primary-foreground`}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Request OTP Code"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="email"
                type="email"
                readOnly
                defaultValue={userData?.user.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Enter OTP</Label>
              <PasswordInput id="otp" {...register("otp")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput id="newPassword" {...register("password")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                {...register("confirm_password")}
                id="confirmPassword"
              />
            </div>
          </div>
          <Button
            disabled={holdPasswordBtn || passwordLoader}
            onClick={handleChangePassword}
            className={`bg-primary ${
              holdPasswordBtn || passwordLoader ? "opacity-30" : ""
            } hover:bg-primary/90 text-primary-foreground`}
          >
            {passwordLoader ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about important activities
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive SMS alerts for critical updates
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
