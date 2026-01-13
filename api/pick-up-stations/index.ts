import {
  AddPickupStationPayload,
  ErrorrResponse,
  PickupStationDetails,
  PickupStationResponse,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

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


export const getPickupStations = async (): Promise<PickupStationDetails> => {
  try {
    const res = await api.get("/api/users/admin/pickup-station/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};