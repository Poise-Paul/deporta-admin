import { BusStopTable } from "@/components/bus-stops/bus-stop-table";


export default function BusStopsPage() {
  return (
    <div className="space-y-6">
      <BusStopTable
        title="Bus-Stops"
        addButtonText="Add Bus Stop"
        searchPlaceholder="Search Bus Stop By Name"
        tableTitle="All Bus-Stops"
      />
    </div>
  );
}
