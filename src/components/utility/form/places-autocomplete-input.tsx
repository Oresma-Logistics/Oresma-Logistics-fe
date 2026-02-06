"use client";

import { useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";

type Props = {
  error?: string;
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  inputname: string;
  placeholder?: string;
  label: string;
};

export function PlacesAutocompleteInput({
  error,
  register,
  setValue,
  inputname,
  label,
  placeholder,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    isLoaded,
    predictions,
    isLoadingPredictions,
    fetchPredictions,
    getPlaceDetails,
    clearPredictions,
  } = usePlacesAutocomplete(containerRef);

  const { onChange, onBlur, name, ref } = register(inputname);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
      fetchPredictions(e.target.value);
    },
    [onChange, fetchPredictions]
  );

  const handleSelect = useCallback(
    async (placeId: string) => {
      clearPredictions();
      const details = await getPlaceDetails(placeId);
      const value = details?.formatted_address || details?.name || "";
      if (value) {
        setValue(inputname, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [inputname, setValue, getPlaceDetails, clearPredictions]
  );

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        const refObject = ref as React.MutableRefObject<HTMLInputElement | null>;
        refObject.current = element;
      }
    },
    [ref]
  );

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
      <div
        ref={containerRef}
        className="absolute w-px h-px overflow-hidden"
        aria-hidden
        tabIndex={-1}
      />
      <div className="flex justify-between">
        <Label htmlFor={inputname} className="text-foreground font-medium">
          {label}
        </Label>
      </div>
      <div className="relative">
        <Input
          id={inputname}
          name={name}
          ref={setInputRef}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={(e) => e.target.value && fetchPredictions(e.target.value)}
          placeholder={placeholder}
          className="h-11 bg-background border-input focus:border-primary transition-colors"
          disabled={!isLoaded}
          spellCheck={false}
          autoComplete="off"
        />
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!isLoaded && (
        <div className="text-xs text-gray-500">Loading Google Maps...</div>
      )}
    </div>
  );
}
