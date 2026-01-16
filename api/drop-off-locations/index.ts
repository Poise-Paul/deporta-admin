import { AddPickupStationPayload, DropOffDetails, DropOffLocationResponse, EditDropOffStationPayload, ErrorrResponse, Response } from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import toast from "react-hot-toast";
import axios from "axios";
import { store } from "@/lib/store";
import { updateDropOffDetails } from "@/lib/store/slices/drop-off-station-slice";

export const getDropOffStations = async (): Promise<DropOffDetails> => {
  try {
    const res = await api.get("/api/users/admin/drop-off-station/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useCreateDropOffStation = () => {
  return useMutation({
    mutationFn: async (data: AddPickupStationPayload) => {
      const res = await api.post("/api/users/admin/drop-off-station/create", {
        address: data.address,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: DropOffLocationResponse) => {
      queryClient.invalidateQueries({ queryKey: ["dropOffStations"] });
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

export const useDeleteDropOffStation = () => {
  return useMutation({
    mutationFn: async (stationId: string) => {
      const res = await api.delete(
        `/api/users/admin/drop-off-station/delete/${stationId}`
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["dropOffStations"] });
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

export const useModifyDropOffStation = () => {
  return useMutation({
    mutationFn: async (data: EditDropOffStationPayload) => {
      const res = await api.patch("/api/users/admin/drop-off-station/edit", {
        drop_off_station_id: data.drop_off_location_id,
        address: data.address,
        area: data.area,
        state: data.state,
        country: data.country,
      });
      return res.data;
    },
    onSuccess: (data: DropOffLocationResponse) => {
      queryClient.invalidateQueries({ queryKey: ["dropOffStations"] });
      store.dispatch(updateDropOffDetails(data.drop_off_station));
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
