"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJsApiLoader } from "@react-google-maps/api";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  error?: string;
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  inputname: string;
  placeholder?: string;
  label: string;
};

const libraries: "places"[] = ["places"];

export function PlacesAutocompleteInput({
  error,
  register,
  setValue,
  inputname,
  label,
  placeholder,
}: Props) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Register the input with react-hook-form
  const { onChange, onBlur, name, ref } = register(inputname);

  // Handle place selection from Google Autocomplete
  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      // Update react-hook-form value
      setValue(inputname, place.formatted_address, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    }
  }, [inputname, setValue]);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["formatted_address", "geometry"],
          componentRestrictions: { country: "ng" }, // Restrict to Nigeria
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);

      setIsGoogleLoaded(true);
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, handlePlaceSelect]);

  // Set up ref callback to merge react-hook-form ref with our ref
  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        // Use MutableRefObject which allows assignment of null
        const refObject = ref as React.MutableRefObject<HTMLInputElement | null>;
        refObject.current = element;
      }
    },
    [ref]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputname} className="text-foreground font-medium">
          {label}
        </Label>
      </div>
      <Input
        id={inputname}
        name={name}
        ref={setInputRef}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="h-11 bg-background border-input focus:border-primary transition-colors"
        disabled={!isLoaded}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!isLoaded && (
        <div className="text-xs text-gray-500">Loading Google Maps...</div>
      )}
    </div>
  );
}
