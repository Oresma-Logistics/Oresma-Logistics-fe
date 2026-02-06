"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];
const COUNTRY = "ng";
const DEBOUNCE_MS = 300;

export interface PlacePrediction {
  place_id: string;
  description: string;
  main_text?: string;
  secondary_text?: string;
}

export interface PlaceDetails {
  formatted_address?: string;
  name?: string;
}

export function usePlacesAutocomplete(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Create AutocompleteService when loaded (no DOM needed)
  useEffect(() => {
    if (!isLoaded || !window.google?.maps?.places) return;
    autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
  }, [isLoaded]);

  // PlacesService is created lazily in getPlaceDetails when containerRef is available
  const getPlacesService = useCallback(() => {
    if (placesServiceRef.current) return placesServiceRef.current;
    if (containerRef.current && window.google?.maps?.places) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(containerRef.current);
    }
    return placesServiceRef.current;
  }, [containerRef]);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!autocompleteServiceRef.current || !input.trim()) {
        setPredictions([]);
        return;
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        setIsLoadingPredictions(true);
        const restrictions = { country: COUNTRY };
        const request = { input: input.trim(), componentRestrictions: restrictions };

        // Fetch addresses and establishments in parallel
        let settled = 0;
        const resultsMap = new Map<string, PlacePrediction>();

        const tryFinish = () => {
          settled++;
          if (settled === 2) {
            setPredictions(Array.from(resultsMap.values()));
            setIsLoadingPredictions(false);
          }
        };

        autocompleteServiceRef.current!.getPlacePredictions(
          { ...request, types: ["address"] },
          (addrResults) => {
            addrResults?.forEach((p) => {
              const pred: PlacePrediction = {
                place_id: p.place_id ?? "",
                description: p.description ?? "",
                main_text: p.structured_formatting?.main_text,
                secondary_text: p.structured_formatting?.secondary_text,
              };
              if (pred.place_id) resultsMap.set(pred.place_id, pred);
            });
            tryFinish();
          }
        );

        autocompleteServiceRef.current!.getPlacePredictions(
          { ...request, types: ["establishment"] },
          (estResults) => {
            estResults?.forEach((p) => {
              const pred: PlacePrediction = {
                place_id: p.place_id ?? "",
                description: p.description ?? "",
                main_text: p.structured_formatting?.main_text,
                secondary_text: p.structured_formatting?.secondary_text,
              };
              if (pred.place_id) resultsMap.set(pred.place_id, pred);
            });
            tryFinish();
          }
        );
      }, DEBOUNCE_MS);
    },
    []
  );

  const getPlaceDetails = useCallback(
    (placeId: string): Promise<PlaceDetails | null> => {
      return new Promise((resolve) => {
        const service = getPlacesService();
        if (!service) {
          resolve(null);
          return;
        }
        service.getDetails(
          {
            placeId,
            fields: ["formatted_address", "name"],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              resolve({
                formatted_address: place.formatted_address,
                name: place.name ?? undefined,
              });
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    [getPlacesService]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    isLoaded,
    predictions,
    isLoadingPredictions,
    fetchPredictions,
    getPlaceDetails,
    clearPredictions,
  };
}
