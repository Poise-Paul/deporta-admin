import Link from "next/link"
import { BusDetails } from "@/components/buses/bus-details"
import { MaintenanceReport } from "@/components/buses/maintenance-report"
import { ChevronLeft } from "lucide-react"

export default async function BusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/app-menu/buses" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          All Buses
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{id}</span>
      </div>

      {/* Bus Details */}
      <BusDetails busId={id} />

      {/* Maintenance Report */}
      <MaintenanceReport busId={id} />
    </div>
  )
}
