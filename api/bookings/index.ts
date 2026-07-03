import {
  AllBookingsResponse,
  BookingTotalIncomeResponse,
  BookingTotalResponse,
  CoOperateAccountsResponse,
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

export const getTotalBooking = async (
  status?: "pending" | "paid",
): Promise<BookingTotalResponse> => {
  try {
    // If a status is passed, add the query parameter. Otherwise, just use the base URL.
    const url = status
      ? `/api/users/admin/booking/get/total?status=${status}`
      : `/api/users/admin/booking/get/total`;

    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error("Fetch Booking Error:", error);
    throw error;
  }
};

export const getPendingBookings = async (): Promise<BookingTotalResponse> => {
  try {
    const res = await api.get(`/api/users/admin/booking/get/total?status`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getAllBookings = async (
  page: number = 1,
  limit: number = 10,
): Promise<AllBookingsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await api.get(
      `/api/users/admin/booking/get?${params.toString()}`,
    );

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

// Co-Operate Endpoints
export const useEditCorporateCreditPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      allow_credit_payment: boolean;
      corporate_type_id: string;
    }) => {
      const res = await api.patch(
        `/api/users/admin/corporate/credit-payment/edit`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["co-operate"] });
      toast.success(data.message);
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

export const getCooperateAccounts = async (
  page: number = 1,
  limit: number = 10,
): Promise<CoOperateAccountsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const res = await api.get(
      `/api/users/admin/corporate?${params.toString()}`,
    );
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};
