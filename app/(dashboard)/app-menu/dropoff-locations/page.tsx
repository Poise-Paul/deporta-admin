import { LocationTable } from "@/components/shared/location-table"

const dropoffLocations = [
  {
    id: 1,
    name: "CMS Under Bridge, CMS",
    area: "CMS",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "05/05/2025",
    status: "active" as const,
  },
  {
    id: 2,
    name: "Obalende, Obalende",
    area: "Obalende",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "12/05/2025",
    status: "inactive" as const,
  },
  {
    id: 3,
    name: "Ikorodu Garage, Ikorodu",
    area: "Ikorodu",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "16/06/2025",
    status: "active" as const,
  },
  {
    id: 4,
    name: "Iyana Oworo, Bus-Stop, Iyana Oworo",
    area: "Iyana Oworo",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "18/05/2025",
    status: "active" as const,
  },
  {
    id: 5,
    name: "Oshodi, Walklane, Oshodi",
    area: "Oshodi",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "18/05/2025",
    status: "inactive" as const,
  },
  {
    id: 6,
    name: "Yaba, WAEC Office, Yaba",
    area: "Yaba",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "20/07/2025",
    status: "active" as const,
  },
]

export default function DropoffLocationsPage() {
  return (
    <div className="space-y-6">
      <LocationTable
        title="Drop Off Locations"
        addButtonText="Add Drop Off Location"
        searchPlaceholder="Search Drop Off Location By Name"
        locations={dropoffLocations}
        tableTitle="All Drop Off Locations"
      />
    </div>
  )
}
