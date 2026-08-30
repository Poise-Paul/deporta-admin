import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api } from "../axios";
import { ErrorrResponse, Response } from "@/types";

export type Audience = "all-users" | "drivers" | "staffs" | "customers";

export type PushNotificationPayload = {
  title: string;
  message: string;
  user_type: Audience;
};

export type BroadcastEmailPayload = {
  Highlight_Label: string;
  Highlight_Value: string;
  Message_Title: string;
  Message_Body: string;
  Unsubscribe_Link: string;
  CTA_URL: string;
  CTA_Label: string;
  user_type: Audience;
};

export const useSendPushNotification = () => {
  return useMutation({
    mutationFn: async (data: PushNotificationPayload) => {
      const res = await api.post("/api/users/admin/cms/notification", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(data?.message || "Push notification sent");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to send push notification"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const useSendBroadcastEmail = () => {
  return useMutation({
    mutationFn: async (data: BroadcastEmailPayload) => {
      const res = await api.post("/api/users/admin/cms/email", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(data?.message || "Broadcast email sent");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to send broadcast email"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};
