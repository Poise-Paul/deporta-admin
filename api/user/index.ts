import {
  CustomerDashboardStats,
  StaffDashboardStats,
  StaffListResponse,
  UserDataResponse,
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

export const getStaffList = async (): Promise<StaffListResponse> => {
  try {
    const res = await api.get("/api/users/admin/staffs");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getAllCustomers = async (): Promise<CustomerDashboardStats> => {
  try {
    const res = await api.get("/api/users/admin/staff/total");
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
