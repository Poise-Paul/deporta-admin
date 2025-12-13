import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

const drivers = [
  {
    id: 1,
    name: "Korede Agbaje",
    email: "davidkolawole@gmail.com",
    joinedDate: "14 March, 2025",
    avatar: "/african-driver-man.jpg",
  },
  {
    id: 2,
    name: "Davies Frank",
    email: "daviesfrank@gmail.com",
    joinedDate: "18 March, 2025",
    avatar: "/man-driver-professional.jpg",
  },
  {
    id: 3,
    name: "Collins Davies",
    email: "collinsdavies@gmail.com",
    joinedDate: "20 April, 2025",
    avatar: "/young-man-casual-portrait.png",
  },
]

export function DashboardDrivers() {
  return (
    <Card className="bg-card border border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Drivers on site / Bus on site</CardTitle>
        <Switch />
      </CardHeader>
      <CardContent className="space-y-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Avatar className="h-10 w-10">
              <AvatarImage src={driver.avatar || "/placeholder.svg"} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{driver.name}</p>
              <p className="text-xs text-muted-foreground truncate">{driver.email}</p>
              <p className="text-xs text-muted-foreground">Joined: {driver.joinedDate}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Link href="/app-menu/drivers" className="block text-center text-sm text-primary hover:underline py-2">
          View All Drivers
        </Link>
      </CardContent>
    </Card>
  )
}
