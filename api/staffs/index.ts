import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import {
  AddAdminPayload,
  AddStaffPayload,
  AdminDataResponse,
  ErrorrResponse,
  Response,
} from "@/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { queryClient } from "../queryClient";

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async (data: AddAdminPayload) => {
      const res = await api.post("/api/users/developer/admin/add", {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        otp: data.otp,
        gender: data.gender,
      });
      return res.data;
    },
    onSuccess: (data: AdminDataResponse) => {
      toast.success(`${data.message}`);
      return data;
    },
    onError: (error, variables) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;

        toast.error(`${err?.error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const useCreateStaff = () => {
  return useMutation({
    mutationFn: async (data: AddStaffPayload) => {
      const res = await api.post("/api/users/admin/staff/add", {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        gender: data.gender,
        role: data.role,
      });
      return res.data;
    },
    onSuccess: (data: AdminDataResponse) => {
      toast.success(`${data.message}`);
      return data;
    },
    onError: (error, variables) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        console.log("User Erro", error);

        toast.error(`${err?.error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/api/users/request-password-edit", {
        email,
      });
      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(`${data.message}`);
      return data;
    },
    onError: (error, variables) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        console.log("User Erro", error);

        toast.error(`${err?.error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};
