import type { TawkChannel, TawkChatDoc, TawkTicketDoc } from "./types"

/**
 * tawk.io's exact webhook payload shape isn't confirmed for this property yet.
 * These extractors try several plausible field names and return null when the
 * required ID is missing, so an unrecognized shape just skips normalization
 * instead of throwing — the raw event is always stored separately either way.
 * Once real payloads land (see tawkEvent docs), tighten these to the real keys.
 */
function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

function pickString(obj: unknown, paths: string[]): string | undefined {
  for (const path of paths) {
    const value = get(obj, path)
    if (typeof value === "string" && value.trim()) return value
  }
  return undefined
}

export function extractEventName(body: unknown): string {
  return pickString(body, ["event", "type", "eventType"]) ?? "unknown"
}

export function normalizeChat(body: unknown, event: string, channel: TawkChannel): TawkChatDoc | null {
  if (!event.toLowerCase().includes("chat")) return null

  const chat = (get(body, "chat") ?? get(body, "data.chat") ?? body) as unknown
  const chatId = pickString(chat, ["id", "chatId", "sessionId"])
  if (!chatId) return null

  const lower = event.toLowerCase()
  const status: TawkChatDoc["status"] = lower.includes("missed")
    ? "missed"
    : lower.includes("end")
      ? "ended"
      : "active"

  const now = new Date().toISOString()

  return {
    _id: `tawk-chat-${channel}-${chatId}`,
    _type: "tawkChat",
    channel,
    chatId,
    status,
    visitorName: pickString(chat, ["visitor.name", "sender.name", "name"]),
    visitorEmail: pickString(chat, ["visitor.email", "sender.email", "email"]),
    department: pickString(chat, ["department.name", "department"]),
    startedAt: pickString(chat, ["startedAt", "createdAt", "time"]) ?? (status === "active" ? now : undefined),
    endedAt: status === "ended" ? (pickString(chat, ["endedAt", "time"]) ?? now) : undefined,
    lastEventAt: now,
  }
}

export function normalizeTicket(body: unknown, event: string, channel: TawkChannel): TawkTicketDoc | null {
  if (!event.toLowerCase().includes("ticket")) return null

  const ticket = (get(body, "ticket") ?? get(body, "data.ticket") ?? body) as unknown
  const ticketId = pickString(ticket, ["id", "ticketId", "number"])
  if (!ticketId) return null

  const rawStatus = pickString(ticket, ["status"])?.toLowerCase()
  const status: TawkTicketDoc["status"] =
    rawStatus === "open" || rawStatus === "pending" || rawStatus === "closed" ? rawStatus : "unknown"

  const now = new Date().toISOString()

  return {
    _id: `tawk-ticket-${channel}-${ticketId}`,
    _type: "tawkTicket",
    channel,
    ticketId,
    subject: pickString(ticket, ["subject", "title"]),
    status,
    priority: pickString(ticket, ["priority"]),
    requesterName: pickString(ticket, ["requester.name", "requestedBy.name", "sender.name"]),
    requesterEmail: pickString(ticket, ["requester.email", "requestedBy.email", "sender.email"]),
    createdAt: pickString(ticket, ["createdAt", "time"]) ?? now,
    updatedAt: now,
  }
}
