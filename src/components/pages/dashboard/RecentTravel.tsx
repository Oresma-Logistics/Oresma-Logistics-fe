"use client";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { TripCard } from "@/components/shared/dashboard/trip-card";
import { Suspense } from "react";

const recentTrips = [
  {
    image: "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319030/car_zqtkkv.png",
    title: "Lagos - Abuja",
    subtitle: "512 Station Carry Blue",
    distance: "12,400",
    price: "11,900",
  },
  {
    image: "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319030/car_zqtkkv.png",
    title: "Lagos - Enugu",
    subtitle: "512 Station Carry Blue",
    distance: "12,400",
    price: "11,900",
  },
  {
    image: "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319030/car_zqtkkv.png",
    title: "Lagos - Ondo",
    subtitle: "512 Station Carry Blue",
    distance: "12,400",
    price: "11,900",
  },
];
export function RecentTravel() {
  return (
    <div className="">
      {/* Recent Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Taxi Trips</h2>
          <Suspense>
            <PeriodSelector
              options={[
                { label: "Last 7 days", value: "7days" },
                { label: "Last 2 weeks", value: "2weeks" },
                { label: "Last 1 month", value: "1month" },
                { label: "Last 2 months", value: "2months" },
                { label: "Last 1 year", value: "1year" },
              ]}
              paramName="tripsPeriod"
              defaultValue="7d"
            />
          </Suspense>
        </div>
        <div className="max-h-[350px] space-y-3 overflow-y-auto my-scroll">
          {recentTrips.map((trip, index) => (
            <TripCard key={index} {...trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
