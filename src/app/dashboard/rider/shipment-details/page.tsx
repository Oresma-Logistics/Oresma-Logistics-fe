import { Suspense } from "react";
import { ShipmentDetailsForm } from "@/components/pages/dashboard/rider/shipment-details";

export default function ShipmentDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShipmentDetailsForm />
    </Suspense>
  );
}
