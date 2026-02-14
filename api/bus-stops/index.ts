import {
  AddBusStopPayload,
  BusStopData,
  BusStopResponse,
  EditBusStopPayload,
  ErrorrResponse,
  NewBusStopPayload,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import toast from "react-hot-toast";
import axios from "axios";
import { store } from "@/lib/store";
import { updateBusStopDetails } from "@/lib/store/slices/bus-stop-slice";

export interface BusStopPayload {
  status: string;
  bus_stop_id: string;
}

export const getAllBusStops = async (): Promise<BusStopData> => {
  try {
    const res = await api.get("/api/users/admin/bus-stop/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useCreateBusStop = () => {
  return useMutation({
    mutationFn: async (data: AddBusStopPayload) => {
      console.log("Added Bus Stop", {
        routes: data.routes,
        location: data.location,
        area: data.area,
        state: data.state,
        country: data.country,
      });

      const res = await api.post("/api/users/admin/bus-stop/create", {
        routes: data.routes,
        location: data.location,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: BusStopResponse) => {
      queryClient.invalidateQueries({ queryKey: ["busStops"] });
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

export const useModifyBusStop = () => {
  return useMutation({
    mutationFn: async (data: NewBusStopPayload) => {
      const res = await api.patch("/api/users/admin/bus-stop/edit", {
        bus_stop_id: data.bus_stop_id,
        routes: data.routes,
        location: data.location,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: BusStopResponse) => {
      queryClient.invalidateQueries({ queryKey: ["busStops"] });
      console.log("Bus Stop==", data.bus_stop);

      store.dispatch(updateBusStopDetails(data.bus_stop));
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

export const useDeleteBusStop = () => {
  return useMutation({
    mutationFn: async (stationId: string) => {
      const res = await api.delete(
        `/api/users/admin/bus-stop/delete/${stationId}`,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["busStops"] });
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

export const useBusStopStatus = () => {
  return useMutation({
    mutationFn: async (data: BusStopPayload) => {
      const res = await api.patch(
        `/api/users/admin/bus-stop/change/status`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["busStops"] });
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
