"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LocationInput } from "@/components/shared/map/location-input";
import { RouteMap } from "@/components/shared/map/route-map";
import { VehicleSelector } from "@/components/shared/map/vehicle-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RouteInfo } from "@/components/shared/map/route-info";
import { LorryRecommendation } from "./lorryReconmended";
import { availableMemory } from "process";

const vehicles = [
  {
    id: "car",
    name: "Car",
    image:
      "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319030/car_zqtkkv.png",
    price: "₦2,500",
    available: false,
  },
  {
    id: "dispatch",
    name: "Dispatch",
    image:
      "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319026/dispatch_tcox7e.jpg",
    price: "₦1,800",
    available: false,
  },
  {
    id: "keke",
    name: "Keke",
    image:
      "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319037/keke_mngdxu.png",
    price: "₦800",
    available: true,
  },
  {
    id: "lorry",
    name: "Lorry",
    image:
      "https://res.cloudinary.com/duyhha3mz/image/upload/v1760319027/lorry_djnre2.png",
    price: "₦5,000",
    available: true,
  },
];

export function Booking() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const params = new URLSearchParams();
  const params2 = useSearchParams();
  const naviagate = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<{
    duration: string;
    distance: string;
  } | null>(null);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedOrigin = Cookies.get("routeOrigin");
    const savedDestination = Cookies.get("routeDestination");

    if (savedOrigin) setOrigin(savedOrigin);
    if (savedDestination) setDestination(savedDestination);
  }, []);

  console.log(params2.get("vehicle"));

  const handleSearch = () => {
    if (origin && destination) {
      Cookies.set("routeOrigin", origin, { expires: 1 / 24 });
      Cookies.set("routeDestination", destination, { expires: 1 / 24 });

      setIsSearching(true);
      setShouldCalculate(true);
    }
  };

  const handleRouteCalculated = (duration: string, distance: string) => {
    setRouteData({ duration, distance });
    setIsSearching(false);
    setShouldCalculate(false);
  };

  const handleFindDriver = () => {
    if (origin && destination && selectedVehicle) {
      params.set("vehicle", selectedVehicle);
      naviagate.push(`?${params.toString()}`);
    } else {
      alert("Please enter both locations and select a vehicle");
    }
  };

  return (
    <>
      <div>
        <Card className="mb-6 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Where would you like to go?
          </h2>
          <div className="space-y-4">
            <div>
              <LocationInput
                label="Start Location"
                placeholder="Enter start location"
                icon="start"
                value={origin}
                onChange={setOrigin}
                isLoading={isSearching}
              />
            </div>
            <div>
              <LocationInput
                label="Destination"
                placeholder="Enter destination"
                icon="destination"
                value={destination}
                onChange={setDestination}
                onSubmit={handleSearch}
                isLoading={isSearching}
              />
            </div>
          </div>
        </Card>
        {origin && destination && routeData && (
          <RouteInfo
            origin={origin}
            destination={destination}
            duration={routeData?.duration}
            distance={routeData?.distance}
          />
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <RouteMap
            origin={origin}
            destination={destination}
            className="h-[400px] lg:h-[500px]"
            onRouteCalculated={handleRouteCalculated}
            shouldCalculate={shouldCalculate}
            isLoading={isSearching}
          />
        </div>
      </div>

      {/* Vehicle Selection */}
      {origin && destination && routeData && (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Select Your Vehicle</h3>
          <VehicleSelector
            vehicles={vehicles}
            onSelectVehicle={setSelectedVehicle}
            selectedVehicle={selectedVehicle}
          />
        </div>
      )}

      {/* Find Driver Button */}
      {origin && destination && selectedVehicle && (
        <div className="flex justify-center w-full mt-10">
          <Button
            onClick={handleFindDriver}
            className="w-full bg-orange-500 hover:bg-orange-600  md:px-16 py-7 text-lg font-semibold"
          >
            Find a driver
          </Button>
        </div>
      )}
      {/* Lorry reconmended her */}
      {params2.get("vehicle") === "lorry" && <LorryRecommendation />}
    </>
  );
}
