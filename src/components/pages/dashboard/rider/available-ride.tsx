"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { DriverDetailsModal } from "./riderDetail";

const driversData = [
  {
    id: 1,
    driverName: "Mr Austin",
    driverImage: "/professional-driver-avatar.jpg",
    distance: "2 min away",
    rating: 4,
    totalRides: 56,
    vehicleName: "Sedan Blue",
    vehicleType: "Camry",
    vehicleImage: "/blue-sedan.png",
    passengers: 4,
    plateNumber: "ABC-123-XY",
  },
  {
    id: 2,
    driverName: "Mrs Sarah",
    driverImage: "/female-driver-avatar.jpg",
    distance: "5 min away",
    rating: 5,
    totalRides: 89,
    vehicleName: "Honda Civic",
    vehicleType: "Sedan",
    vehicleImage: "/silver-honda-civic.png",
    passengers: 4,
    plateNumber: "XYZ-456-AB",
  },
  {
    id: 3,
    driverName: "Mr David",
    driverImage: "/male-driver-avatar.jpg",
    distance: "3 min away",
    rating: 4,
    totalRides: 72,
    vehicleName: "Toyota Corolla",
    vehicleType: "White",
    vehicleImage: "/white-toyota-corolla.png",
    passengers: 4,
    plateNumber: "DEF-789-GH",
  },
  {
    id: 4,
    driverName: "Mr James",
    driverImage: "/driver-with-cap-avatar.jpg",
    distance: "7 min away",
    rating: 5,
    totalRides: 103,
    vehicleName: "Lexus ES",
    vehicleType: "Black",
    vehicleImage: "/black-lexus-sedan.jpg",
    passengers: 4,
    plateNumber: "GHI-012-JK",
  },
];

export function AvailableRide() {
  const params = useSearchParams();

  if (!params.get("vehicle") || params.get("vehicle") === "lorry") {
    return null;
  }

  return (
    <div className="w-full lg:max-w-[420px] min-w-[320px] bg-[#F8F9FC] rounded-3xl py-6 px-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[calc(100%-250px)]">
      <h3 className="font-semibold text-2xl text-gray-900 mb-6">
        Drivers near you
      </h3>

      <div className="grid grid-cols-1 gap-6 ] ">
        {driversData.map((driver) => (
          <RiderCard key={driver.id} driver={driver} />
        ))}
      </div>
    </div>
  );
}

interface RiderCardProps {
  driver: {
    id: number;
    driverName: string;
    driverImage: string;
    distance: string;
    rating: number;
    totalRides: number;
    vehicleName: string;
    vehicleType: string;
    vehicleImage: string;
    passengers: number;
    plateNumber?: string;
  };
}

function RiderCard({ driver }: RiderCardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const riderId = searchParams.get("rider");
  const showDetails = riderId === driver.id.toString();

  const handleBookRide = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("rider", driver.id.toString());
    router.push(`?${params.toString()}`);
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("rider");
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Driver Info Card */}
        <div className="bg-white rounded-xl shadow-md flex justify-between py-4 px-4 items-center gap-3">
          <div className="relative w-[50px] h-[50px] flex-shrink-0">
            <Image
              src={driver.driverImage || "/placeholder.svg"}
              alt={driver.driverName}
              fill
              className="object-cover rounded-full"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              Driver: {driver.driverName}
            </h4>
            <p className="font-normal text-xs text-gray-600">
              Distance: {driver.distance}
            </p>
          </div>

          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <div className="flex gap-0.5 items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-3.5 h-3.5 ${
                    index < driver.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs font-normal text-gray-600 whitespace-nowrap">
              No. of rides: {driver.totalRides}
            </div>
          </div>
        </div>

        {/* Vehicle Info Card */}
        <div className="bg-white rounded-xl shadow-md flex justify-between py-4 px-4 items-center gap-3">
          <div className="relative w-[50px] h-[50px] flex-shrink-0">
            <Image
              src={driver.vehicleImage || "/placeholder.svg"}
              alt={driver.vehicleName}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {driver.vehicleName}
            </h4>
            <p className="font-normal text-xs text-gray-600">
              {driver.vehicleType}
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="text-sm font-medium text-gray-900">
              {driver.passengers} Passengers
            </div>
          </div>
        </div>

        {/* Book Ride Button */}
        <Button
          onClick={handleBookRide}
          className="w-full bg-[#FBB298] hover:bg-secondaryT text-gray-900 hover:text-white font-medium shadow-md py-6 rounded-xl transition-colors"
        >
          Book Ride
        </Button>
      </div>

      {/* Driver Details Modal */}
      <DriverDetailsModal
        open={showDetails}
        onOpenChange={handleCloseModal}
        driver={driver}
      />
    </>
  );
}
