import {
  AddBusPayload,
  BusesResponse,
  ErrorrResponse,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

export const getBuses = async (): Promise<BusesResponse> => {
  try {
    const res = await api.get("/api/users/admin/buses/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: async (data: AddBusPayload) => {
      const formData = new FormData();

      // 1. Handle the Image
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      // 2. Handle Arrays (routes_assigned & drivers_assigned)
      // We append each item separately using the same key name
      data.routes_assigned.forEach((route) => {
        if (route) formData.append("routes_assigned[]", route);
      });

      data.drivers_assigned.forEach((driver) => {
        if (driver) formData.append("drivers_assigned[]", driver);
      });

      // 3. Handle Primitive Fields
      formData.append("id_code", data.id_code);
      formData.append("name_label", data.name_label);
      formData.append("plate_number", data.plate_number);
      formData.append("capacity", data.capacity);
      formData.append("operation_schedule", data.operation_schedule);

      // Convert boolean to string "true" or "false"
      formData.append("status", String(data.status));

      formData.append("fuel_type", data.fuel_type);
      formData.append("tracker_id", data.tracker_id);
      formData.append("mileage", data.mileage);

      const res = await api.post("/api/users/admin/buses/create", formData, {
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
