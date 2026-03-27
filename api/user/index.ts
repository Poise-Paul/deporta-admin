import {
  CustomerDashboardStats,
  CustomerListResponse,
  OnsiteDriverDataResponse,
  StaffDashboardStats,
  StaffListResponse,
  UserDataResponse,
  UsersDataListResponse,
  UsersTotalResponse,
} from "@/types";
import { api } from "../axios";
import { store } from "@/lib/store";

export const getUser = async (): Promise<UserDataResponse> => {
  try {
    const res = await api.get("/api/users/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getStaffList = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  role?: string,
): Promise<StaffListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);
  if (status && status !== "all") params.append("status", status);

  try {
    const res = await api.get(`/api/users/admin/staffs?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getUsersList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
): Promise<UsersDataListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    const res = await api.get(`/api/users/admin/users?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getAllCustomers = async (): Promise<CustomerDashboardStats> => {
  try {
    const res = await api.get("/api/users/admin/customers/total");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getCustomerList = async (
  page: number,
  limit: number,
): Promise<CustomerListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await api.get(`/api/users/admin/customer?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getAllDrivers = async (): Promise<StaffDashboardStats> => {
  try {
    const res = await api.get("/api/users/admin/drivers/total");
    return res.data;
  } catch (error) {
    console.error("Fetch Drivers Error:", error);
    // Return a default structure so the UI doesn't break
    return { data: [], total: 0 } as unknown as StaffDashboardStats;
  }
};

export const getOnsiteDrivers = async (): Promise<StaffDashboardStats> => {
  try {
    const res = await api.get("/api/users/admin/onsite-drivers/total");
    return res.data;
  } catch (error) {
    console.error("Fetch Onsite Drivers Error:", error);
    // Return a default structure
    return { data: [], total: 0 } as unknown as StaffDashboardStats;
  }
};

export const getOnsiteData = async (): Promise<OnsiteDriverDataResponse> => {
  try {
    const res = await api.get("/api/users/admin/drivers/onsite");
    return res.data;
  } catch (error) {
    console.error("Fetch Onsite Drivers Error:", error);
    // Return a default structure
    return { data: [], total: 0 } as unknown as OnsiteDriverDataResponse;
  }
};

export const getTotalUsers = async (): Promise<UsersTotalResponse> => {
  try {
    const res = await api.get("/api/users/admin/users/total");
    return res.data;
  } catch (error) {
    console.error("Fetch All Users Error:", error);
    // Return a default structure
    return { data: [], total: 0 } as unknown as UsersTotalResponse;
  }
};
