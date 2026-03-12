import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { api } from "../axios";
import { ErrorrResponse, Response, TotalIncomeResponse, UpdateStaff } from "@/types";
import toast from "react-hot-toast";
import axios from "axios";

export const useStaffStatus = () => {
  return useMutation({
    mutationFn: async (data: UpdateStaff) => {
      const res = await api.patch(`/api/users/admin/user/change-status`, data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("User Account Updated Successfully");
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

export const getDashboardTotal = async (): Promise<TotalIncomeResponse> => {
  try {
    const res = await api.get(
      "/api/users/admin/income-by-args/total?args=total",
    );
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};