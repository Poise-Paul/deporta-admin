import { LocationTable } from "@/components/shared/location-table"

const routes = [
  {
    id: 1,
    name: "AJUB - OSBR (Ajah to Oshodi)",
    area: "Lagos Mainland",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "05/05/2025",
    status: "active" as const,
  },
  {
    id: 2,
    name: "FST - CMS (Festac to CMS)",
    area: "Lagos Island",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "12/05/2025",
    status: "active" as const,
  },
  {
    id: 3,
    name: "IKD - OWO (Ikorodu to Oworo)",
    area: "Lagos Mainland",
    state: "Lagos, Nigeria",
    addedBy: "admin@deportalogistics.com",
    dateAdded: "16/06/2025",
    status: "inactive" as const,
  },
]

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <LocationTable
        title="Routes"
        addButtonText="Add Route"
        searchPlaceholder="Search Route By Name"
        locations={routes}
        tableTitle="All Routes"
      />
    </div>
  )
}
