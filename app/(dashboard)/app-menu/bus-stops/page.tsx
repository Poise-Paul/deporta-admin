import { BusStopTable } from "@/components/bus-stops/bus-stop-table";

const busStops = [
  {
    id: 1,
    name: "Ajah Bridge Bus Stop",
    area: "Ajah",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "05/05/2025",
    status: "active" as const,
  },
  {
    id: 2,
    name: "Sangotedo Junction",
    area: "Sangotedo",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "12/05/2025",
    status: "active" as const,
  },
  {
    id: 3,
    name: "Lekki Phase 1 Gate",
    area: "Lekki",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "16/06/2025",
    status: "inactive" as const,
  },
]

export default function BusStopsPage() {
  return (
    <div className="space-y-6">
      <BusStopTable
        title="Bus-Stops"
        addButtonText="Add Bus Stop"
        searchPlaceholder="Search Bus Stop By Name"
        locations={busStops}
        tableTitle="All Bus-Stops"
      />
    </div>
  );
}
