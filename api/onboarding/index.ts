import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import { ErrorrResponse, LoginPayload, LoginResponse } from "@/types";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post("/api/users/sign-in", {
        email: data.email,
        password: data.password,
      });
      return res.data;
    },
    onSuccess: (data: LoginResponse) => {
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
