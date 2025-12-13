import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Mail, Clock } from "lucide-react"

const recentTickets = [
  {
    id: "TKT-001",
    subject: "Payment not reflecting",
    customer: "David Kolawole",
    status: "open",
    priority: "high",
    date: "2 hours ago",
  },
  {
    id: "TKT-002",
    subject: "App crash on Android",
    customer: "Jessica Franklin",
    status: "in-progress",
    priority: "medium",
    date: "5 hours ago",
  },
  {
    id: "TKT-003",
    subject: "Route inquiry",
    customer: "Miracle Jerly",
    status: "resolved",
    priority: "low",
    date: "1 day ago",
  },
]

export default function SupportPage() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Live Chat</p>
              <p className="text-sm text-muted-foreground">5 active chats</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Phone className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="font-semibold">Call Queue</p>
              <p className="text-sm text-muted-foreground">3 waiting</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Email Support</p>
              <p className="text-sm text-muted-foreground">12 unread</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Support Tickets</CardTitle>
          <Button variant="outline">View All Tickets</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.id} · {ticket.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className={
                      ticket.status === "open"
                        ? "border-red-500 text-red-600"
                        : ticket.status === "in-progress"
                          ? "border-orange-500 text-orange-600"
                          : "border-green-500 text-green-600"
                    }
                  >
                    {ticket.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ticket.date}
                  </span>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
