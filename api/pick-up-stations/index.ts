import {
  AddPickupStationPayload,
  EditPickupStationPayload,
  ErrorrResponse,
  PickUpStation,
  PickupStationDetails,
  PickupStationResponse,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { queryClient } from "../queryClient";
import { useDispatch } from "react-redux";
import { store } from "@/lib/store";
import {
  updatePickupDetails,
  updateSelPickupStation,
} from "@/lib/store/slices/pickup-station-slice";

export interface PickupPayload {
  status: string;
  pickup_station_id: string;
}

export const getPickupStations = async (
  page: number,
  limit: number,
): Promise<PickupStationDetails> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await api.get(
      `/api/users/admin/pickup-station/get?${params.toString()}`,
    );
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useCreatePickupStation = () => {
  return useMutation({
    mutationFn: async (data: AddPickupStationPayload) => {
      const res = await api.post("/api/users/admin/pickup-station/create", {
        address: data.address,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: PickupStationResponse) => {
      queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
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

export const useModifyPickupStation = () => {
  return useMutation({
    mutationFn: async (data: PickUpStation) => {
      const res = await api.patch("/api/users/admin/pickup-station/edit", {
        pickup_station_id: data.pickup_station_id,
        address: data.address,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: PickupStationResponse) => {
      queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
      store.dispatch(updatePickupDetails(data.pickup_station));
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

export const useDeletePickupStation = () => {
  return useMutation({
    mutationFn: async (stationId: string) => {
      const res = await api.delete(
        `/api/users/admin/pickup-station/delete/${stationId}`,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
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

export const usePickupStatus = () => {
  return useMutation({
    mutationFn: async (data: PickupPayload) => {
      const res = await api.patch(
        `/api/users/admin/pickup-station/change/status`,
        data,
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
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
