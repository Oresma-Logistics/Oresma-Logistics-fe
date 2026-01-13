"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import L from "leaflet";

// Fix for default marker icons in Next.js (only on client side)
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface RouteMapProps {
  origin: string;
  destination: string;
  className?: string;
  onRouteCalculated?: (duration: string, distance: string) => void;
  shouldCalculate?: boolean;
  isLoading?: boolean;
}

interface RouteResult {
  coordinates: [number, number][];
  duration: string;
  distance: string;
  originCoords: [number, number];
  destCoords: [number, number];
}

const defaultCenter: [number, number] = [6.5244, 3.3792];

// Component to fit map bounds to route
function MapBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  
  return null;
}

export function RouteMap({
  origin,
  destination,
  className,
  onRouteCalculated,
  shouldCalculate = false,
  isLoading = false,
}: RouteMapProps) {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const lastRequestTime = useRef<number>(0);

  // Geocode addresses to coordinates
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    if (!address || address.trim().length === 0) {
      console.warn("Empty address provided for geocoding");
      return null;
    }

    try {
      // Respect Nominatim rate limits (1 request per second)
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
      }
      lastRequestTime.current = Date.now();
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.trim())}&limit=1&addressdetails=1&countrycodes=ng`,
        {
          headers: {
            'User-Agent': 'Oresma-Logistics-App/1.0',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error(`Geocoding failed with status ${response.status}: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`No results found for address: ${address}`);
        return null;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lon)) {
        console.error(`Invalid coordinates returned for address: ${address}`, result);
        return null;
      }

      return [lat, lon];
    } catch (error) {
      console.error("Geocoding error for address:", address, error);
      return null;
    }
  };

  // Calculate route using OSRM
  const calculateRoute = async () => {
    if (!origin || !destination) {
      setError("Please provide both origin and destination addresses");
      return;
    }

    if (!origin.trim() || !destination.trim()) {
      setError("Addresses cannot be empty");
      return;
    }

    setInternalLoading(true);
    setError(null);

    try {
      // Geocode addresses sequentially to respect rate limits
      const originCoords = await geocodeAddress(origin);
      if (!originCoords) {
        throw new Error(`Could not geocode origin address: "${origin}"`);
      }

      const destCoords = await geocodeAddress(destination);
      if (!destCoords) {
        throw new Error(`Could not geocode destination address: "${destination}"`);
      }

      // Get route from OSRM (format: lon,lat;lon,lat)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("Could not calculate route");
      }

      const routeData = data.routes[0];
      // Convert GeoJSON coordinates [lon, lat] to Leaflet format [lat, lon]
      const coordinates = routeData.geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]) as [number, number][];

      // Format duration and distance
      const durationSeconds = Math.round(routeData.duration);
      const durationMinutes = Math.round(durationSeconds / 60);
      const durationText = durationMinutes > 60 
        ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
        : `${durationMinutes}m`;

      const distanceKm = (routeData.distance / 1000).toFixed(1);
      const distanceText = `${distanceKm} km`;
      const distanceValue = parseFloat(distanceKm); // Store numeric distance value

      const routeResult: RouteResult = {
        coordinates,
        duration: durationText,
        distance: distanceText,
        originCoords,
        destCoords,
      };

      setRoute(routeResult);
      setHasCalculated(true);
      localStorage.setItem("destination", destination);
      // Store numeric distance in localStorage for price calculation
      localStorage.setItem("routeDistanceKm", distanceValue.toString());
      onRouteCalculated?.(durationText, distanceText);
    } catch (err) {
      console.error("Error calculating route:", err);
      setError("Unable to calculate route. Please check your locations.");
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (shouldCalculate && !hasCalculated && !internalLoading) {
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCalculate, hasCalculated, internalLoading]);

  const isSearching = isLoading || internalLoading;

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

      {route && (
        <>
          <div style={{ width: "100%", height: "400px" }}>
            <MapContainer
              center={route.originCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBounds coordinates={route.coordinates} />
              <Polyline
                positions={route.coordinates}
                pathOptions={{ color: "#ff6347", weight: 6, opacity: 0.9 }}
              />
              <Marker position={route.originCoords}>
                <Popup>{origin}</Popup>
              </Marker>
              <Marker position={route.destCoords}>
                <Popup>{destination}</Popup>
              </Marker>
            </MapContainer>
          </div>

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
                    {route.duration && (
                      <span className="ml-auto text-sm text-orange-600">
                        - {route.duration}
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

          {route.duration && (
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-full bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
                {route.duration}
              </div>
            </div>
          )}
        </>
      )}

      <div className="pointer-events-none absolute inset-0 z-[5]" />
    </div>
  );
}
