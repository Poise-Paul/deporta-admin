import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api } from "../axios";
import { queryClient } from "../queryClient";
import { ErrorrResponse, Response } from "@/types";

export type FaqRecord = {
  _id: string;
  title: string;
  paragraph: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FaqsPage = {
  faqs: FaqRecord[];
  total: number;
};

// Confirmed shape: { status, faqs: { data: FaqRecord[], pagination: { count, ... } } }.
// Kept a couple of fallbacks in case the shape drifts, so this degrades to an
// empty list instead of throwing.
function extractFaqsPage(raw: unknown): FaqsPage {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const faqsField = obj.faqs;

    if (faqsField && typeof faqsField === "object" && !Array.isArray(faqsField)) {
      const inner = faqsField as Record<string, unknown>;
      const data = Array.isArray(inner.data) ? (inner.data as FaqRecord[]) : [];
      const pagination = inner.pagination as { count?: number } | undefined;
      return { faqs: data, total: pagination?.count ?? data.length };
    }
    if (Array.isArray(faqsField)) {
      return { faqs: faqsField as FaqRecord[], total: faqsField.length };
    }
    if (Array.isArray(obj.data)) {
      return { faqs: obj.data as FaqRecord[], total: obj.data.length };
    }
  }
  if (Array.isArray(raw)) {
    return { faqs: raw as FaqRecord[], total: raw.length };
  }
  return { faqs: [], total: 0 };
}

export const useFaqs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await api.get("/api/users/faqs/admin/get", {
        params: { page: 1, limit: 100 },
      });
      return extractFaqsPage(res.data);
    },
  });
};

export const useCreateFaq = () => {
  return useMutation({
    mutationFn: async (data: { title: string; paragraph: string }) => {
      const res = await api.post("/api/users/faqs/create", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(data?.message || "FAQ created");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to create FAQ"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const useEditFaq = () => {
  return useMutation({
    mutationFn: async (data: { faq_id: string; title: string; paragraph: string }) => {
      const res = await api.patch("/api/users/faqs/edit", data);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(data?.message || "FAQ updated");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to update FAQ"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};

export const useDeleteFaq = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/users/faqs/delete/${id}`);
      return res.data;
    },
    onSuccess: (data: Response) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(data?.message || "FAQ deleted");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data as ErrorrResponse;
        toast.error(`${err?.error?.message || "Failed to delete FAQ"}`);
      } else {
        console.error("❌ Unexpected error:", error);
      }
    },
  });
};
