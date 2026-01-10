"use client";

import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon?: "start" | "destination";
  onSubmit?: () => void;
  isLoading?: boolean;
}

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce geocoding requests to respect Nominatim rate limits
  const debouncedGeocode = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=ng`,
        {
          headers: {
            'User-Agent': 'Oresma-Logistics-App' // Required by Nominatim
          }
        }
      );
      const data: GeocodeResult[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Geocoding error:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  useEffect(() => {
    if (value) {
      debouncedGeocode(value);
    } else {
      setSuggestions([]);
    }
  }, [value, debouncedGeocode]);

  const handleSelectSuggestion = (suggestion: GeocodeResult) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 z-10 ${iconColor}`}
          />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow suggestion click
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <p className="text-sm text-gray-900">{suggestion.display_name}</p>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
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
