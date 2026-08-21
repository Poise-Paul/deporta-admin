import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api } from "../axios";
import { ErrorrResponse, Response } from "@/types";

export type BroadcastPayload = {
  title: string;
  message: string;
};

export const useSendPushNotification = () => {
  return useMutation({
    mutationFn: async (data: BroadcastPayload) => {
      const res = await api.post("/api/users/admin/cms/notification", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(data?.message || "Push notification sent to all users");
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
    mutationFn: async (data: BroadcastPayload) => {
      const res = await api.post("/api/users/admin/cms/email", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(data?.message || "Broadcast email sent to all users");
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
