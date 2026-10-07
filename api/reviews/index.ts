import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { DriverReviewsResponse, ErrorrResponse, Response } from "@/types";
import { api } from "../axios";
import { queryClient } from "../queryClient";

export const getDriverReviews = async (
  driverId: string,
  page: number = 1,
  limit: number = 10,
): Promise<DriverReviewsResponse> => {
  const params = new URLSearchParams({
    driver_id: driverId,
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const res = await api.get(`/api/users/review/driver?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch Driver Reviews Error:", error);
    throw error;
  }
};

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/users/review/delete/${id}`);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["driver-reviews"] });
      toast.success(data?.message || "Review deleted");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to delete review"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};
