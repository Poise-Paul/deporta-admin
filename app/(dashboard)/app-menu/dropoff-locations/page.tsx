import { DropOffStation } from "@/components/shared/drop-off-location";

export default function DropoffLocationsPage() {
  return (
    <div className="space-y-6">
      <DropOffStation
        title="Drop Off Locations"
        addButtonText="Add Drop Off Location"
        searchPlaceholder="Search Drop Off Location By Name"
        tableTitle="All Drop Off Locations"
      />
    </div>
  );
}
