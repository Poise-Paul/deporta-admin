import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, Wallet, Users, MapPin, Bus } from "lucide-react"

const stats = [
  {
    title: "Total made today",
    value: "₦ 585,984.87",
    icon: Wallet,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Admin Staffs",
    value: "28",
    icon: Users,
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Ongoing Trips",
    value: "913",
    icon: MapPin,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Users on the app",
    value: "500",
    icon: Bus,
    color: "bg-blue-100 text-blue-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <button className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1">
                View details
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
