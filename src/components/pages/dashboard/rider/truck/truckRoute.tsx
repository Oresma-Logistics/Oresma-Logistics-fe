"use client";
import { LocationInput } from "@/components/shared/map/location-input";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { RouteInfo } from "@/components/shared/map/route-info";
import { RouteMap } from "@/components/shared/map/route-map";
import { Button } from "@/components/ui/button";
import { TruckProcesing } from "./truckProcessing";
import Cookies from "js-cookie";
import { Edit2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createRideRequest } from "@/_lib/api/dashboard/rider/ride-request";
import { showToast } from "@/components/shared/toast";

export default function BookingTruck() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeData, setRouteData] = useState<{
    duration: string;
    distance: string;
  } | null>(null);
  const [openProcessingModal, setOpenProcessingModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedOrigin = Cookies.get("routeOrigin");
    const savedDestination = Cookies.get("routeDestination");

    if (savedOrigin) setOrigin(savedOrigin);
    if (savedDestination) setDestination(savedDestination);

    // If both locations exist, automatically trigger calculation
    if (savedOrigin && savedDestination) {
      setShouldCalculate(true);
      setIsSearching(true);
    }
  }, []);
  const mutation = useMutation({
    mutationFn: createRideRequest,
    mutationKey: ["create Ride Truck"],
    onSuccess: (data) => {
      if (data.success) {
        setOpenProcessingModal(true);
      }
    },
    onError: (error) => {
      showToast.error("Request Failed", error.message);
    },
  });

  const handleRouteCalculated = (duration: string, distance: string) => {
    setRouteData({ duration, distance });
    setIsSearching(false);
    setShouldCalculate(false);
  };

  const handleSearch = () => {
    if (origin && destination) {
      Cookies.set("routeOrigin", origin, { expires: 1 / 24 }); // 1 hour
      Cookies.set("routeDestination", destination, { expires: 1 / 24 });

      setIsSearching(true);
      setShouldCalculate(true);
      setIsEditing(false);
    }
  };

  const handleOrder = async () => {
    await mutation.mutateAsync({
      pickup: {
        address: origin,
      },
      dropoff: {
        address: destination,
      },
      vehicleType: "truck",
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleClearLocations = () => {
    setOrigin("");
    setDestination("");
    setRouteData(null);
    Cookies.remove("routeOrigin");
    Cookies.remove("routeDestination");
    setIsEditing(false);
  };

  return (
    <>
      {/* Display route info when available */}
      <div>
        {origin && destination && routeData && (
          <RouteInfo
            origin={origin}
            destination={destination}
            duration={routeData?.duration}
            distance={routeData?.distance}
          />
        )}
      </div>

      {/* Map Display */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
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

      {/* Location Input Section */}
      <div>
        <Card className="p-6 mt-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your trip details</h2>
            {origin && destination && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleEditMode}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleEditMode}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            )}
          </div>

          {isEditing || !origin || !destination ? (
            // Edit Mode - Show input fields
            <div className="space-y-4">
              <div>
                <LocationInput
                  label="Start Location"
                  placeholder="Enter start location"
                  icon="start"
                  value={origin}
                  onChange={setOrigin}
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
              <Button
                onClick={handleSearch}
                disabled={!origin || !destination || isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSearching ? "Searching..." : "Search Route"}
              </Button>
            </div>
          ) : (
            // View Mode - Show saved locations
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">
                  Start Location
                </label>
                <p className="text-lg font-semibold text-gray-900">{origin}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">
                  Destination
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {destination}
                </p>
              </div>
            </div>
          )}

          {origin && destination && !isEditing && (
            <div className="space-y-3 mt-6">
              <Button
                variant="ghost"
                className="bg-secondaryT w-full hover:bg-secondaryT/90 text-white hover:text-white"
                onClick={handleOrder}
                disabled={mutation.isPending}
              >
                Confirm order
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearLocations}
              >
                Change Locations
              </Button>
            </div>
          )}
        </Card>
      </div>

      <TruckProcesing
        open={openProcessingModal}
        onOpenChange={() => {
          setOpenProcessingModal(false);
        }}
      />
    </>
  );
}
