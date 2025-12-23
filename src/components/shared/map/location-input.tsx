"use client";

import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon?: "start" | "destination";
  onSubmit?: () => void;
  isLoading?: boolean;
}

const libraries: "places"[] = ["places"];

export function LocationInput({
  value,
  onChange,
  placeholder,
  label,
  icon = "start",
  onSubmit,
  isLoading = false,
}: LocationInputProps) {
  const iconColor = icon === "start" ? "text-yellow-500" : "text-gray-900";
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["formatted_address", "geometry"],
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      setIsGoogleLoaded(true);
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 z-10 ${iconColor}`}
          />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading || !isLoaded}
          />
        </div>
        {icon === "destination" && onSubmit && (
          <Button
            onClick={onSubmit}
            disabled={isLoading || !value}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              "Search"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
