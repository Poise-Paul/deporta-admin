import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity/client"

export const revalidate = 0

const QUERY = /* groq */ `{
  "customer": {
    "activeChats": count(*[_type == "tawkChat" && channel == "customer" && status == "active"]),
    "openTickets": count(*[_type == "tawkTicket" && channel == "customer" && status in ["open", "pending"]]),
    "chatsToday": count(*[_type == "tawkChat" && channel == "customer" && defined(startedAt) && startedAt >= $todayStart]),
    "tickets": *[_type == "tawkTicket" && channel == "customer"] | order(coalesce(updatedAt, createdAt) desc) [0...10] {
      _id, ticketId, subject, status, priority, requesterName, requesterEmail, createdAt, updatedAt
    },
    "chats": *[_type == "tawkChat" && channel == "customer" && status == "active"] | order(startedAt desc) [0...10] {
      _id, chatId, visitorName, visitorEmail, department, startedAt
    }
  },
  "driver": {
    "activeChats": count(*[_type == "tawkChat" && channel == "driver" && status == "active"]),
    "openTickets": count(*[_type == "tawkTicket" && channel == "driver" && status in ["open", "pending"]]),
    "chatsToday": count(*[_type == "tawkChat" && channel == "driver" && defined(startedAt) && startedAt >= $todayStart]),
    "tickets": *[_type == "tawkTicket" && channel == "driver"] | order(coalesce(updatedAt, createdAt) desc) [0...10] {
      _id, ticketId, subject, status, priority, requesterName, requesterEmail, createdAt, updatedAt
    },
    "chats": *[_type == "tawkChat" && channel == "driver" && status == "active"] | order(startedAt desc) [0...10] {
      _id, chatId, visitorName, visitorEmail, department, startedAt
    }
  }
}`

export async function GET() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  try {
    const data = await sanityClient.fetch(QUERY, { todayStart: todayStart.toISOString() })
    return NextResponse.json({ status: true, data })
  } catch (error) {
    console.error("Failed to load support overview:", error)
    return NextResponse.json({ status: false, message: "Failed to load support data" }, { status: 500 })
  }
}
