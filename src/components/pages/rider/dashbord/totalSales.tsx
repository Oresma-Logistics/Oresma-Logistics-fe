"use client";
// import { AreaChartComponent } from "@/components/shared/dashboard/area-chart";
import { AreaChart2Component } from "@/components/shared/dashboard/area-chart-2";
const data = [
  { name: "Jan", value: 0 },
  { name: "Feb", value: 0 },
  { name: "Mar", value: 0 },
  { name: "Apr", value: 0 },
  { name: "May", value: 0 },
  { name: "June", value: 0 },
];
export default function TotalSales() {
  return (
    <AreaChart2Component
      title="Total Sales"
      data={data}
      areaColor="#1E3A8A"
      totalValue={"N0"}
    />
  );
}
