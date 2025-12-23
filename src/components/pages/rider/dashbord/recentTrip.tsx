import { DataTableCard } from "@/components/shared/dashboard/data-table-pie-card";
export function RecentTrip() {
  const recentTripsData: { label: string; value: string }[] = [];
  return (
    <DataTableCard
      title="Recent trips"
      data={recentTripsData}
      percentage={0}
      percentageLabel="OCCUPIED"
      headers={["Car", "ID no"]}
      highlighted
      oddRowColor=" #021533"
      evenRowColor="#f75720"
    />
  );
}
