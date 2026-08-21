"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MessageSquare, Ticket, CalendarClock, Clock, ExternalLink, Loader2 } from "lucide-react"
import { useSupportOverview, type SupportChannelOverview } from "@/api/support"

const CHANNELS = [
  {
    key: "customer" as const,
    label: "Customer Support",
    propertyId: process.env.NEXT_PUBLIC_TAWK_CUSTOMER_PROPERTY_ID,
  },
  {
    key: "driver" as const,
    label: "Driver Support",
    propertyId: process.env.NEXT_PUBLIC_TAWK_DRIVER_PROPERTY_ID,
  },
]

const ticketStatusStyle: Record<string, string> = {
  open: "border-red-500 text-red-600",
  pending: "border-orange-500 text-orange-600",
  closed: "border-green-500 text-green-600",
  unknown: "border-muted-foreground text-muted-foreground",
}

function timeAgo(iso?: string) {
  if (!iso) return "—"
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function SupportChannelPanel({
  overview,
  isLoading,
  isError,
  tawkDashboardUrl,
}: {
  overview: SupportChannelOverview | undefined
  isLoading: boolean
  isError: boolean
  tawkDashboardUrl: string
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Live Chat</p>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading…" : `${overview?.activeChats ?? 0} active chats`}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Ticket className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="font-semibold">Support Tickets</p>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading…" : `${overview?.openTickets ?? 0} open`}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CalendarClock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Chats Today</p>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading…" : `${overview?.chatsToday ?? 0} started today`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isError && (
        <Card className="bg-card border border-destructive/50">
          <CardContent className="p-4 text-sm text-destructive">
            Couldn&apos;t reach support data. The tawk.io webhook may not be configured yet, or Sanity credentials are missing.
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Support Tickets</CardTitle>
          <Button variant="outline" asChild>
            <a href={tawkDashboardUrl} target="_blank" rel="noopener noreferrer">
              Open in Tawk.to
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading tickets…
            </div>
          ) : !overview?.tickets.length ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No tickets yet. Once the tawk.io webhook is wired up and a ticket comes in, it&apos;ll show up here.
            </p>
          ) : (
            <div className="space-y-4">
              {overview.tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{ticket.subject ?? "Untitled ticket"}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.ticketId} · {ticket.requesterName ?? ticket.requesterEmail ?? "Unknown requester"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={ticketStatusStyle[ticket.status]}>
                      {ticket.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(ticket.updatedAt ?? ticket.createdAt)}
                    </span>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={tawkDashboardUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function SupportPage() {
  const { data, isLoading, isError } = useSupportOverview()

  return (
    <Tabs defaultValue="customer" className="space-y-6">
      <TabsList>
        {CHANNELS.map((channel) => (
          <TabsTrigger key={channel.key} value={channel.key}>
            {channel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {CHANNELS.map((channel) => (
        <TabsContent key={channel.key} value={channel.key}>
          <SupportChannelPanel
            overview={data?.data[channel.key]}
            isLoading={isLoading}
            isError={isError}
            tawkDashboardUrl={
              channel.propertyId
                ? `https://dashboard.tawk.to/#/admin/${channel.propertyId}`
                : "https://dashboard.tawk.to/"
            }
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
