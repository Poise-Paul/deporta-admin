import {
  AllBookingsResponse,
  BookingTotalIncomeResponse,
  BookingTotalResponse,
  NewBookingPayload,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

// Booking Rentals Dashboard Stats
export const getTotalIncome = async (): Promise<BookingTotalIncomeResponse> => {
  try {
    const res = await api.get(`/api/users/admin/booking/get/total/income`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getTotalBooking = async (): Promise<BookingTotalResponse> => {
  try {
    const res = await api.get(`/api/users/admin/booking/get/total`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getAllBookings = async (): Promise<AllBookingsResponse> => {
  try {
    const res = await api.get(`/api/users/admin/booking/get`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewBookingPayload) => {
      const res = await api.post(`/api/users/admin/booking/create`, data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          `${error.response?.data?.error?.message || "Creation failed"}`,
        );
      }
    },
  });
};

export const useEditBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.patch(`/api/users/admin/booking/edit`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated successfully");
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          `${error.response?.data?.error?.message || "Update failed"}`,
        );
      }
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/users/admin/booking/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          `${error.response?.data?.error?.message || "Delete failed"}`,
        );
      }
    },
  });
};
