"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, Phone } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface DriverDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: {
    id: number | string;
    driverName: string;
    driverImage: string;
    distance: string;
    rating: number;
    totalRides: number;
    vehicleName: string;
    vehicleType: string;
    vehicleImage: string;
    passengers: number;
    price?: number;
    estimatedTime?: number;
    distanceKm?: number;
    plateNumber?: string;
  };
}

export function DriverDetailsModal({
  open,
  onOpenChange,
  driver,
}: DriverDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[440px] p-8 rounded-3xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-24">
              <Image
                src={"/Frame 138.png"}
                alt={driver.driverName}
                fill
                className="object-cover rounded-full"
              />
            </div>

            {/* Driver Name */}
            <h2 className="text-2xl font-semibold text-gray-900">
              {driver.driverName}
            </h2>
          </div>
          {/* Driver Image */}

          {/* Vehicle Name */}
          <p className="text-base text-gray-600">{driver.vehicleName}</p>

          {/* Star Rating */}
          <div className="flex gap-1 items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < Math.floor(driver.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="ml-2 text-lg font-medium text-gray-900">
              {driver.rating.toFixed(1)}
            </span>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {/* Distance */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <p className="text-lg font-semibold text-gray-900">
                {driver.distanceKm || "24.6"} km
              </p>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="text-lg font-semibold text-gray-900">
                {driver.price || "22,500"}{" "}
                <span className="text-xs text-gray-500">/cash</span>
              </p>
            </div>

            {/* Time */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {driver.estimatedTime || "30"}{" "}
                <span className="text-xs text-gray-500">/mins</span>
              </p>
            </div>
          </div>

          {/* Plate Number Card */}
          <div className="bg-gray-50 rounded-2xl p-4 w-full text-center">
            <p className="text-xs text-gray-500 mb-1">Plate Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {driver.plateNumber || "ABC-123-XY"}
            </p>
          </div>

          {/* Call Button */}
          <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-medium py-6 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Call via Phone
          </Button>
          <Button className="w-full bg-[#FBB298] hover:bg-secondaryT text-primaryT hover:text-white border-2 border-gray-200 font-medium py-6 rounded-xl transition-colors flex items-center justify-center gap-2">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
