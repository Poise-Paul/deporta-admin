import {
  AddBusPayload,
  BusEditResponse,
  BusesResponse,
  EditBusPayload,
  ErrorrResponse,
  MaintenancePayload,
  MaintenanceReportResponse,
  MaintenanceResponse,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { queryClient } from "../queryClient";

export interface BusStatusType {
  status: string;
  bus_id: string;
}

export interface MaintainancePayload {
  is_maintenance: boolean;
  bus_id: string;
}

export const getAllBuses = async (): Promise<BusesResponse> => {
  try {
    const res = await api.get("/api/users/admin/bus/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useCreateBus = () => {
  return useMutation({
    mutationFn: async (data: AddBusPayload) => {
      const formData = new FormData();

      if (data.image) {
        data.image.forEach((file) => {
          formData.append("image", file);
        });
      }

      formData.append("routes_assigned", JSON.stringify(data.routes_assigned));
      formData.append(
        "drivers_assigned",
        JSON.stringify(data.drivers_assigned),
      );

      // 3. Handle Primitive Fields
      formData.append("id_code", data.id_code);
      formData.append("name_label", data.name_label);
      formData.append("plate_number", data.plate_number);
      formData.append("capacity", data.capacity);
      formData.append(
        "operation_schedule",
        JSON.stringify({
          from: data.operation_schedule.from,
          to: data.operation_schedule.to,
        }),
      );
      // Convert boolean to string "true" or "false"
      formData.append("status", String(data.status));

      formData.append("fuel_type", data.fuel_type);
      formData.append("tracker_id", data.tracker_id);
      formData.append("mileage", data.mileage);

      console.log("Bus Data 045", formData);

      const res = await api.post("/api/users/admin/bus/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: (data: Response) => {
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["allBuses"] });
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

export const useDeleteBus = () => {
  return useMutation({
    mutationFn: async (stationId: string) => {
      const res = await api.delete(`/api/users/admin/buses/bus/${stationId}`);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["allBuses"] });
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

export const useModifyBuses = () => {
  return useMutation({
    mutationFn: async (data: EditBusPayload) => {
      const formData = new FormData();

      if (data.image) {
        data.image.forEach((file) => {
          formData.append("image", file);
        });
      }

      if (data.delete_bus_photo && data.delete_bus_photo.length > 0) {
        formData.append(
          "delete_bus_photo",
          JSON.stringify(data.delete_bus_photo),
        );
      }

      formData.append("routes_assigned", JSON.stringify(data.routes_assigned));
      formData.append(
        "drivers_assigned",
        JSON.stringify(data.drivers_assigned),
      );

      // 3. Handle Primitive Fields
      formData.append("bus_id", data.bus_id);
      formData.append("id_code", data.id_code);
      formData.append("name_label", data.name_label);
      formData.append("plate_number", data.plate_number);
      formData.append("capacity", `${data.capacity}`);
      formData.append(
        "operation_schedule",
        JSON.stringify({
          from: data.operation_schedule.from,
          to: data.operation_schedule.to,
        }),
      );
      formData.append("status", String(data.status));

      formData.append("fuel_type", data.fuel_type);
      formData.append("tracker_id", data.tracker_id);
      formData.append("mileage", data.mileage);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Bus Details Update>><>🚌🚐", formData);

      const res = await api.patch(`/api/users/admin/bus/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: (data: BusEditResponse) => {
      toast.success(`${data.message}`);
      //   store.dispatch(updateBusDetails())
      queryClient.invalidateQueries({ queryKey: ["allBuses"] });
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

export const useBusStatus = () => {
  return useMutation({
    mutationFn: async (data: BusStatusType) => {
      const res = await api.patch(`/api/users/admin/bus/change/status`, data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Updated Successfully");
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

export const useBusMaintenanceStatus = () => {
  return useMutation({
    mutationFn: async (data: MaintainancePayload) => {
      const res = await api.patch(
        `/api/users/admin/bus/change/maintenance`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      toast.success("Updated Successfully");
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

export const useCreateReport = () => {
  return useMutation({
    mutationFn: async (data: MaintenancePayload) => {
      const res = await api.post(
        "/api/users/admin/maintenance-report/create",
        data,
      );
      return res.data;
    },
    onSuccess: (data: MaintenanceResponse) => {
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

export const getMaintenanceReports = async (
  currentPage: number,
  perPage: number,
): Promise<MaintenanceReportResponse> => {
  try {
    const res = await api.get(
      `/api/users/admin/maintenance-report/get?limit=${perPage}&page=${currentPage}`,
    );
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};
