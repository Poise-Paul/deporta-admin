import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import {
  AddAdminPayload,
  AddStaffPayload,
  AdminDataResponse,
  DriversDataResponse,
  ErrorrResponse,
  ProfileUpdate,
  Response,
  StaffDashboardStats,
  StatusPayload,
  StatusResponse,
} from "@/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { queryClient } from "../queryClient";
import { useDispatch } from "react-redux";
import {
  updateSelStaff,
  updateStaffStatus,
} from "@/lib/store/slices/staff-slice";

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

export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: async (data: ProfileUpdate) => {
      const formData = new FormData();

      const formattedDate = new Date(data.date_of_birth).toISOString();

      if (data.image instanceof File) {
        formData.append("image", data.image); // 👈 actual File object
      }

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("phone_number", data.phone_number);
      formData.append("date_of_birth", formattedDate);

      const res = await api.patch("/api/users/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
        toast.error(`${err?.error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

// Mutation for Toggle Status (Activate/Deactivate)

export const useStatusUpdate = () => {
  // 1. Change the first generic from 'Response' to 'StatusResponse'
  const dispatch = useDispatch();
  return useMutation<StatusResponse, Error, StatusPayload>({
    mutationFn: async (data: StatusPayload) => {
      const res = await api.patch(`/api/users/admin/user/change-status`, {
        status: data.status,
        user_id: data.user_id,
      });

      // 2. Return res.data which is now correctly typed as StatusResponse
      return res.data;
    },
    // 3. This now matches perfectly
    onSuccess: (data: StatusResponse, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });

      // Note: check if variables.isActive is the string "active" or a boolean
      // to make the toast message accurate
      const isNowActive = variables.status === "active";
      dispatch(updateStaffStatus(variables.status));
      toast.success(
        `Staff ${isNowActive ? "Activated" : "De-activated"} successfully`,
      );
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error.message}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const getAllStaffs = async (): Promise<StaffDashboardStats> => {
  try {
    const res = await api.get("/api/users/admin/staff/total");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const getDriversList = async (
  currentPage?: number,
  perPage: number = 10,
  searchTerm?: string,
): Promise<DriversDataResponse> => {
  try {
    const res = await api.get(`/api/users/admin/drivers?limit=${perPage}`);
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};
