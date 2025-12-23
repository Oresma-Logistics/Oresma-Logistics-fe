import { DataTableCard } from "@/components/shared/dashboard/data-table-pie-card";
export function RegisteredVehicle() {
  const registeredVehiclesData: { label: string; value: string }[] = [];
  return (
    <DataTableCard
      title="Registered Vehicles"
      data={registeredVehiclesData}
      percentage={0}
      percentageLabel="OCCUPIED"
      headers={["Car", "ID no"]}
      oddRowColor="#021533"
      evenRowColor="#f75720"
    />
  );
}
