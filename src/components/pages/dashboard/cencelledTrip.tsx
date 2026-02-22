import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { TripCard } from "@/components/shared/dashboard/trip-card";
import { Suspense } from "react";
const cancelledTrips = [
  {
    date: "12 January 2025",
    type: "Lagos – Abuja",
    estimatedCost: "185,000",
    approvedCost: "175,000",
  },
  {
    date: "13 January 2025",
    type: "Port Harcourt – Warri",
    estimatedCost: "95,000",
    approvedCost: "88,000",
  },
  {
    date: "14 January 2025",
    type: "Kano – Kaduna",
    estimatedCost: "72,000",
    approvedCost: "68,500",
  },
  {
    date: "14 January 2025",
    type: "Onitsha – Enugu",
    estimatedCost: "58,000",
    approvedCost: "54,000",
  },
  {
    date: "15 January 2025",
    type: "Ibadan – Lagos",
    estimatedCost: "45,000",
    approvedCost: "42,000",
  },
  {
    date: "15 January 2025",
    type: "Abuja – Jos",
    estimatedCost: "82,000",
    approvedCost: "78,000",
  },
  {
    date: "16 January 2025",
    type: "Benin – Asaba",
    estimatedCost: "38,000",
    approvedCost: "35,500",
  },
];

export function CancelledTrip() {
  return (
    <div className="">
      {/* Recent Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Truck info</h2>
          <Suspense>
            <PeriodSelector
              options={[
                { label: "Last 7 days", value: "7days" },
                { label: "Last 2 weeks", value: "2weeks" },
                { label: "Last 1 month", value: "1month" },
                { label: "Last 2 months", value: "2months" },
                { label: "Last 1 year", value: "1year" },
              ]}
              paramName="cancelledTripsPeriod"
              defaultValue="7d"
            />
          </Suspense>
        </div>
        <div className="space-y-3 max-h-[350px] 3 overflow-y-auto my-scroll">
          {cancelledTrips.map((trip, index) => (
            <TripCard
              key={index}
              title={trip.date}
              subtitle={trip.type}
              distance={trip.estimatedCost}
              price={trip.approvedCost}
              image={"https://res.cloudinary.com/dsmc6vtpt/image/upload/v1771721867/WhatsApp_Image_2026-02-19_at_10.24.10_AM_xb1fbr.jpg"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
