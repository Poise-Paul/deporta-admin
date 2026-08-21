import { useQuery } from "@tanstack/react-query"

export type SupportTicket = {
  _id: string
  ticketId: string
  subject?: string
  status: "open" | "pending" | "closed" | "unknown"
  priority?: string
  requesterName?: string
  requesterEmail?: string
  createdAt?: string
  updatedAt?: string
}

export type SupportChat = {
  _id: string
  chatId: string
  visitorName?: string
  visitorEmail?: string
  department?: string
  startedAt?: string
}

export type SupportChannelOverview = {
  activeChats: number
  openTickets: number
  chatsToday: number
  tickets: SupportTicket[]
  chats: SupportChat[]
}

export type SupportOverviewResponse = {
  status: boolean
  data: {
    customer: SupportChannelOverview
    driver: SupportChannelOverview
  }
}

// Note: this hits this Next.js app's own /api/support route (backed by tawk.io
// webhook data in Sanity), not the Render backend — so it bypasses the shared
// `api` axios instance in api/axios.ts, which is scoped to the Render baseURL.
const fetchSupportOverview = async (): Promise<SupportOverviewResponse> => {
  const res = await fetch("/api/support", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load support data")
  return res.json()
}

export const useSupportOverview = () => {
  return useQuery({
    queryKey: ["support-overview"],
    queryFn: fetchSupportOverview,
    refetchInterval: 20000,
  })
}
