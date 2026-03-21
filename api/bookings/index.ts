import { BookingTotalIncomeResponse, BookingTotalResponse } from "@/types";
import { api } from "../axios";

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
