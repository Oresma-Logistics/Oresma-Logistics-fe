"use client";
// import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import { RouteInfo } from "../../map/route-info";
// import { Clock } from "lucide-react";

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(
  () => import("../../map/route-map").then((mod) => ({ default: mod.RouteMap })),
  { ssr: false }
);

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
  return (
    <div className="w-full">
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
