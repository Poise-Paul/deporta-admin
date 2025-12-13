import { VehicleRentalsStats } from "@/components/logistics/vehicle-rentals-stats"
import { VehicleRentalsTable } from "@/components/logistics/vehicle-rentals-table"

export default function VehicleRentalsPage() {
  return (
    <div className="space-y-6">
      <VehicleRentalsStats />
      <VehicleRentalsTable />
    </div>
  )
}
