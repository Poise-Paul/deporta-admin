import { OutsourceBusDataResponse, OutsourceDriverDataResponse } from "@/types";
import { api } from "../axios";

export const getOutsouceDrivers = async (
  currentPage: number = 1,
  perPage: number = 10,
): Promise<OutsourceDriverDataResponse> => {
  try {
    const res = await api.get(
      `/api/users/admin/drivers?outsourcing=true&limit=${perPage}&page=${currentPage}`,
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Outsource Driver Error:", error);
    // Return a default structure
    return { data: [], total: 0 } as unknown as OutsourceDriverDataResponse;
  }
};

export const getOutsouceBuses = async (
  currentPage: number = 1,
  perPage: number = 10,
): Promise<OutsourceBusDataResponse> => {
  try {
    const res = await api.get(
      `/api/users/admin/bus/get?outsourcing=true&limit=${perPage}&page=${currentPage}`,
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Outsource Buses Error:", error);
    // Return a default structure
    return { data: [], total: 0 } as unknown as OutsourceBusDataResponse;
  }
};
