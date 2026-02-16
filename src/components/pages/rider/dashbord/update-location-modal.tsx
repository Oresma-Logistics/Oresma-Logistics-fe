"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRiderLocation } from "@/_lib/api/rider/rider";
import { showToast } from "@/components/shared/toast";

interface UpdateLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLocationModal({ open, onOpenChange }: UpdateLocationModalProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      updateRiderLocation(lat, lng),
    onSuccess: () => {
      showToast.success("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["riderProfile"] });
      onOpenChange(false);
      setError(null);
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update location";
      showToast.error("Failed to update location", String(msg));
      setError(String(msg));
    },
  });

  const handleUseCurrentLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGettingLocation(false);
        mutation.mutate({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setIsGettingLocation(false);
        const msg =
          err.code === 1
            ? "Location permission denied"
            : err.message || "Unable to get your location";
        setError(msg);
        showToast.error("Location error", msg);
      }
    );
  };

  const isPending = mutation.isPending || isGettingLocation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Update your location
          </DialogTitle>
          <DialogDescription>
            Use your current GPS location so we can assign rides near you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isPending}
            className="w-full gap-2 bg-secondaryT hover:bg-orange-600"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                Use my current location
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
