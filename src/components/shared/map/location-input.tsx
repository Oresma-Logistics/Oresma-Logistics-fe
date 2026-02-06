"use client";

import { useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon?: "start" | "destination";
  onSubmit?: () => void;
  isLoading?: boolean;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    isLoaded,
    predictions,
    isLoadingPredictions,
    fetchPredictions,
    getPlaceDetails,
    clearPredictions,
  } = usePlacesAutocomplete(containerRef);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      onChange(next);
      fetchPredictions(next);
    },
    [onChange, fetchPredictions]
  );

  const handleSelect = useCallback(
    async (placeId: string) => {
      clearPredictions();
      const details = await getPlaceDetails(placeId);
      const displayValue = details?.formatted_address || details?.name || "";
      if (displayValue) onChange(displayValue);
    },
    [getPlaceDetails, onChange, clearPredictions]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        clearPredictions();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearPredictions]);

  return (
    <div ref={wrapperRef} className="space-y-2 relative">
      {/* Hidden div required by Google PlacesService for attributions */}
      <div
        ref={containerRef}
        className="absolute w-px h-px overflow-hidden"
        aria-hidden
        tabIndex={-1}
      />
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 z-10 ${iconColor}`}
          />
          <Input
            value={value}
            onChange={handleInputChange}
            onFocus={() => value && fetchPredictions(value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading || !isLoaded}
            spellCheck={false}
            autoComplete="off"
          />
          {/* Custom dropdown: addresses + establishments */}
          {(predictions.length > 0 || isLoadingPredictions) && (
            <ul
              className="absolute top-full left-0 right-0 z-[9999] mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              role="listbox"
            >
              {isLoadingPredictions && predictions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </li>
              ) : (
                predictions.map((p) => (
                  <li
                    key={p.place_id}
                    role="option"
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(p.place_id);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{p.description}</span>
                  </li>
                ))
              )}
            </ul>
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
