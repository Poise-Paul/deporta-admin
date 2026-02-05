import {
  AddTripRoute,
  EditTripRoute,
  ErrorrResponse,
  GetAllRoutesData,
  GetRoutesResponse,
  Response,
} from "@/types";
import { api } from "../axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { store } from "@/lib/store";
import toast from "react-hot-toast";
import axios from "axios";
import { updateRouteDetails } from "@/lib/store/slices/route-slice";

export const getRoutes = async (): Promise<GetAllRoutesData> => {
  try {
    const res = await api.get("/api/users/admin/trip-route/get");
    return res.data;
  } catch (error) {
    console.error("Fetch User Error:", error);
    throw error;
  }
};

export const useModifyRoutes = () => {
  return useMutation({
    mutationFn: async (data: EditTripRoute) => {
      const res = await api.patch("/api/users/admin/trip-route/edit", {
        trip_route_id: data.trip_route_id,
        rate: data.rate,
        flat_rate: data.flat_rate,
        rate_per_km: data.rate_per_km,
        code: data.code,
        destination: data.destination,
        starting_point: data.starting_point,
        state: data.state,
        country: data.country,
        route_distance: data.route_distance,
        number_of_stops: data.number_of_stops,
      });
      return res.data;
    },
    onSuccess: (data: GetRoutesResponse) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      store.dispatch(updateRouteDetails(data.trip_route));
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

export const useCreateTripRoute = () => {
  return useMutation({
    mutationFn: async (data: AddTripRoute) => {
      const res = await api.post("/api/users/admin/trip-route/create", {
        rate: data.rate,
        flat_rate: data.flat_rate,
        rate_per_km: data.rate_per_km,
        code: data.code,
        destination: data.destination,
        starting_point: data.starting_point,
        route_distance: data.route_distance,
        number_of_stops: data.number_of_stops,
        state: data.state,
        country: data.country,
        routine:data.routine
      });
      return res.data;
    },
    onSuccess: (data: GetRoutesResponse) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
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

export const useDeleteRoute = () => {
  return useMutation({
    mutationFn: async (stationId: string) => {
      const res = await api.delete(
        `/api/users/admin/trip-route/delete/${stationId}`
      );
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
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
