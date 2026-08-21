export type TawkChannel = "customer" | "driver"

export const TAWK_CHANNELS: TawkChannel[] = ["customer", "driver"]

export type TawkChatStatus = "active" | "ended" | "missed"
export type TawkTicketStatus = "open" | "pending" | "closed" | "unknown"

export interface TawkChatDoc {
  _id: string
  _type: "tawkChat"
  channel: TawkChannel
  chatId: string
  status: TawkChatStatus
  visitorName?: string
  visitorEmail?: string
  department?: string
  startedAt?: string
  endedAt?: string
  lastEventAt: string
}

export interface TawkTicketDoc {
  _id: string
  _type: "tawkTicket"
  channel: TawkChannel
  ticketId: string
  subject?: string
  status: TawkTicketStatus
  priority?: string
  requesterName?: string
  requesterEmail?: string
  createdAt?: string
  updatedAt?: string
}
