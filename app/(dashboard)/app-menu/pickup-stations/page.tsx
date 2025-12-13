import { LocationTable } from "@/components/shared/location-table"

const pickupStations = [
  {
    id: 1,
    name: "Ajah Under Bridge, Ajah",
    area: "Ajah",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "05/05/2025",
    status: "active" as const,
  },
  {
    id: 2,
    name: "Co-Operative Villas Bus-Stop, Badore, AJah, Lagos",
    area: "Badore, AJah",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "12/05/2025",
    status: "inactive" as const,
  },
  {
    id: 3,
    name: "Festac Town",
    area: "Festac",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "16/06/2025",
    status: "active" as const,
  },
  {
    id: 4,
    name: "Surulere, Under Bridge",
    area: "Surulere",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "18/05/2025",
    status: "active" as const,
  },
  {
    id: 5,
    name: "Obalende Under Bridge, Obalende",
    area: "Obalende",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "18/05/2025",
    status: "inactive" as const,
  },
  {
    id: 6,
    name: "Sangotedo Shoprite, Sangotedo",
    area: "Sangotedo",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "20/07/2025",
    status: "active" as const,
  },
]

export default function PickupStationsPage() {
  return (
    <div className="space-y-6">
      <LocationTable
        title="Pickup stations"
        addButtonText="Add Pick up Station"
        searchPlaceholder="Search Pickup Station By Name"
        locations={pickupStations}
        tableTitle="All Pickup stations"
      />
    </div>
  )
}
