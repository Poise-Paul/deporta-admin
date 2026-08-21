import crypto from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity/client"
import { extractEventName, normalizeChat, normalizeTicket } from "@/lib/tawk/normalize"
import { TAWK_CHANNELS, type TawkChannel } from "@/lib/tawk/types"

export const runtime = "nodejs"

// tawk.io's "Create Webhook" form has no signing-secret field — it only takes
// a name, an endpoint URL, and event checkboxes. So there's nothing to HMAC
// against. Instead the secret is embedded in the endpoint URL itself (as a
// query param) and checked here; the URL only goes into tawk's config, never
// anywhere public. One tawk property per channel, each with its own secret:
// https://<your-domain>/api/tawk/webhook/customer?secret=<TAWK_CUSTOMER_WEBHOOK_SECRET>
// https://<your-domain>/api/tawk/webhook/driver?secret=<TAWK_DRIVER_WEBHOOK_SECRET>
const WEBHOOK_SECRETS: Record<TawkChannel, string | undefined> = {
  customer: process.env.TAWK_CUSTOMER_WEBHOOK_SECRET,
  driver: process.env.TAWK_DRIVER_WEBHOOK_SECRET,
}

function isTawkChannel(value: string): value is TawkChannel {
  return (TAWK_CHANNELS as string[]).includes(value)
}

function isAuthorized(providedSecret: string | null, expectedSecret: string | undefined) {
  if (!expectedSecret || !providedSecret) return false
  const expectedBuf = Buffer.from(expectedSecret)
  const providedBuf = Buffer.from(providedSecret)
  if (expectedBuf.length !== providedBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ channel: string }> }) {
  const { channel: channelParam } = await params
  if (!isTawkChannel(channelParam)) {
    return NextResponse.json({ error: `Unknown channel "${channelParam}"` }, { status: 404 })
  }
  const channel = channelParam

  const providedSecret = req.nextUrl.searchParams.get("secret")
  const authorized = isAuthorized(providedSecret, WEBHOOK_SECRETS[channel])

  // Reject unauthorized requests by default. Set TAWK_WEBHOOK_ALLOW_UNSIGNED=true
  // locally while calibrating against a real tawk.io test event before the
  // secret is configured (see setup notes).
  const allowUnauthorized =
    process.env.NODE_ENV !== "production" || process.env.TAWK_WEBHOOK_ALLOW_UNSIGNED === "true"
  if (!authorized && !allowUnauthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawBody = await req.text()
  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const event = extractEventName(body)
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const tx = sanityClient.transaction()

  tx.create({
    _type: "tawkEvent",
    channel,
    event,
    receivedAt: new Date().toISOString(),
    authorized,
    headers,
    body,
  })

  const chat = normalizeChat(body, event, channel)
  if (chat) tx.createOrReplace(chat)

  const ticket = normalizeTicket(body, event, channel)
  if (ticket) tx.createOrReplace(ticket)

  try {
    await tx.commit()
  } catch (error) {
    console.error("Failed to persist tawk webhook event:", error)
    return NextResponse.json({ error: "Storage failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true, channel, event, authorized })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params
  return NextResponse.json({ status: "ok", channel })
}
