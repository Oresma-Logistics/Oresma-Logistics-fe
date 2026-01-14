"use client";

import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface RouteMapProps {
  origin: string;
  destination: string;
  className?: string;
  onRouteCalculated?: (duration: string, distance: string) => void;
  shouldCalculate?: boolean;
  isLoading?: boolean;
}

// ✅ Move libraries constant outside to prevent reload warnings
const libraries: "places"[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

export function RouteMap({
  origin,
  destination,
  className,
  onRouteCalculated,
  shouldCalculate = false,
  isLoading = false,
}: RouteMapProps) {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState(false);

  // ✅ Use the stable libraries constant
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    draggable: false,
    gestureHandling: "none",
    keyboardShortcuts: false,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#d4f1e8" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a8ddd1" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }],
      },
    ],
  };

  const calculateRoute = useCallback(async () => {
    if (!isLoaded || !origin || !destination) return;
    if (!window.google || !window.google.maps) return;

    setInternalLoading(true);
    setError(null);

    try {
      const directionsService = new window.google.maps.DirectionsService();

      const result = await new Promise<google.maps.DirectionsResult>(
        (resolve, reject) => {
          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (
                status === window.google.maps.DirectionsStatus.OK &&
                response
              ) {
                resolve(response);
              } else {
                reject(new Error(`Directions request failed: ${status}`));
              }
            }
          );
        }
      );

      setDirections(result);
      setHasCalculated(true);

      if (result.routes[0]?.legs[0]) {
        const leg = result.routes[0].legs[0];
        const durationText = leg.duration?.text || "";
        const distance = leg.distance?.text || "";

        setDuration(durationText);
        localStorage.setItem("destination", destination);
        onRouteCalculated?.(durationText, distance);
      }
    } catch (err) {
      console.error("Error calculating route:", err);
      setError("Unable to calculate route. Please check your locations.");
      // Set hasCalculated to true even on error to prevent infinite loop
      setHasCalculated(true);
    } finally {
      setInternalLoading(false);
    }
  }, [isLoaded, origin, destination, onRouteCalculated]);

  // Reset calculation state when origin or destination changes
  useEffect(() => {
    setHasCalculated(false);
    setError(null);
    setDirections(null);
  }, [origin, destination]);

  useEffect(() => {
    if (shouldCalculate && !hasCalculated && !internalLoading) {
      calculateRoute();
    }
  }, [shouldCalculate, hasCalculated, internalLoading, calculateRoute]);

  const isSearching = isLoading || internalLoading;

  // 🌀 Loading placeholder
  if (!isLoaded) {
    return (
      <Card className="flex items-center justify-center bg-muted/30 h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  if (!origin || !destination) {
    return (
      <Card
        className={`flex items-center justify-center bg-muted/30 ${className}`}
      >
        <p className="text-muted-foreground">
          Enter start and destination to view route
        </p>
      </Card>
    );
  }

  if (!hasCalculated) {
    return (
      <Card
        className={`flex items-center justify-center bg-muted/30 h-full ${className}`}
      >
        <p className="text-muted-foreground">
          Click search to calculate your route
        </p>
      </Card>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {isSearching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <Card className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        </div>
      )}

      {/* ✅ Ensure a stable container element exists before rendering the map */}
      <div style={{ width: "100%", height: "400px" }}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={11}
            options={mapOptions}
          >
            {directions && (
              <>
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#ff6347",
                      strokeWeight: 6,
                      strokeOpacity: 0.9,
                    },
                    suppressMarkers: true,
                  }}
                />

                {directions.routes[0]?.legs[0] && (
                  <>
                    <Marker
                      position={directions.routes[0].legs[0].start_location}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#fbbf24",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 3,
                      }}
                    />
                    <Marker
                      position={directions.routes[0].legs[0].end_location}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#000000",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 3,
                      }}
                    />
                  </>
                )}
              </>
            )}
          </GoogleMap>
        )}
      </div>

      {directions && (
        <div className="absolute left-4 right-4 top-4 z-20">
          <Card className="bg-white/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="text-sm font-medium">{origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-black" />
                  <span className="text-sm font-medium">{destination}</span>
                  {duration && (
                    <span className="ml-auto text-sm text-orange-600">
                      - {duration}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  Entrance
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {directions && duration && (
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
            {duration}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[5]" />
    </div>
  );
}
