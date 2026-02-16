"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { UpdateLocationModal } from "./update-location-modal";

export function UpdateLocationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
        title="Update location"
      >
        <MapPin className="h-4 w-4" />
      </Button>
      <UpdateLocationModal open={open} onOpenChange={setOpen} />
    </>
  );
}
