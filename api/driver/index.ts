import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { queryClient } from "../queryClient";
import toast from "react-hot-toast";
import axios from "axios";
import { ErrorrResponse } from "@/types";

export interface DriverOutsourceType {
  outsourcing: boolean;
  driver_id: string;
}

export interface DriverOnSiteType {
  is_on_site: boolean;
  driver_id: string;
}

export const useOutsourceStatus = () => {
  return useMutation({
    mutationFn: async (data: DriverOutsourceType) => {
      const res = await api.patch(
        `/api/users/admin/driver/change/outsourcing`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver Account Updated Successfully");
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

export const useSiteStatus = () => {
  return useMutation({
    mutationFn: async (data: DriverOnSiteType) => {
      const res = await api.patch(
        `/api/users/admin/driver/change/onsite`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver Account Updated Successfully");
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