"use client";
// import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { RouteMap } from "../../map/route-map";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
// import { RouteInfo } from "../../map/route-info";
// import { Clock } from "lucide-react";

export default function MapRoute({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  const [routeData, setRouteData] = useState<{
    duration: string;
    distance: string;
  } | null>(null);
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    if (origin && destination) {
      setShouldCalculate(true);
      setIsSearching(true);
    }
  }, []);

  const handleRouteCalculated = (duration: string, distance: string) => {
    setRouteData({ duration, distance });
    setIsSearching(false);
    setShouldCalculate(false);
  };

  const handleOpenGoogleMaps = () => {
    if (origin && destination) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleOpenGoogleMaps}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Map className="w-4 h-4" />
          Open in Google Maps
        </Button>
      </div>
      <RouteMap
        origin={origin}
        destination={destination}
        className="h-[400px] lg:h-[500px]"
        onRouteCalculated={handleRouteCalculated}
        shouldCalculate={shouldCalculate}
        isLoading={isSearching}
      />
    </div>
  );
}
