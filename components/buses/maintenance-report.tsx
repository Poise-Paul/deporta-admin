import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface MaintenanceReportProps {
  busId: string
}

const reports = [
  {
    id: 1,
    date: "10/08/2025 | 8:30 Am",
    title: "Engine Warning Light (Oil Pressure)",
    description:
      "Driver reported an illuminated red oil pressure warning light during the morning route (Route AJAH-EB) today, 11/20. They pulled over safely. The engine sounds rougher than usual at low RPMs...",
    staff: {
      name: "Fashina Simisola",
      avatar: "/diverse-woman-smiling.png",
    },
    status: "pending",
    priority: "urgent",
  },
  {
    id: 2,
    date: "10/08/2025 | 8:30 Am",
    title: "Cabin AC Not Cooling",
    description:
      "Driver reported that the main passenger cabin AC unit stopped blowing cold air entirely during the 3 PM route...",
    staff: {
      name: "Olayinka Badamosi",
      avatar: "/african-man-professional.png",
    },
    status: "completed",
    priority: "high",
  },
  {
    id: 3,
    date: "10/08/2025 | 8:30 Am",
    title: "Passenger Side Mirror Cracked",
    description:
      "Noted during the pre-shift inspection: the passenger-side rearview mirror casing is cracked and the glass is loose. It is currently taped for temporary safety but requires immediate replacement before the next route. Action Required: Replace entire mirror assembly.",
    staff: {
      name: "Demisire Oluwatobi",
      avatar: "/young-man-casual.jpg",
    },
    status: "completed",
    priority: "normal",
  },
  {
    id: 4,
    date: "10/08/2025 | 8:30 Am",
    title: "Front Brake Pads Worn",
    description:
      "The driver reported a persistent squealing sound during braking, particularly at low speeds. Technician performed an inspection and confirmed that the front brake pads are worn down to 2mm (replacement threshold is 3mm)...",
    staff: {
      name: "Olayinka Badamosi",
      avatar: "/african-man-professional.png",
    },
    status: "completed",
    priority: "low",
  },
]

export function MaintenanceReport({ busId }: MaintenanceReportProps) {
  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">Maintenance Report</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Report</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Staff</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{report.date}</td>
                  <td className="p-4 max-w-md">
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={report.staff.avatar || "/placeholder.svg"} alt={report.staff.name} />
                        <AvatarFallback>{report.staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{report.staff.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        report.status === "completed"
                          ? "border-green-500 text-green-600"
                          : "border-orange-500 text-orange-600",
                      )}
                    >
                      {report.status === "completed" ? "Completed" : "Pending"} •
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        report.priority === "urgent" && "text-red-600",
                        report.priority === "high" && "text-orange-600",
                        report.priority === "normal" && "text-foreground",
                        report.priority === "low" && "text-muted-foreground",
                      )}
                    >
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}{" "}
                      {report.priority === "urgent" && "•"}
                      {report.priority === "high" && "•"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Show
            <select className="border border-border rounded px-2 py-1 text-sm bg-background">
              <option>4 of 8</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 - Page</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                {"<"}
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                2
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
