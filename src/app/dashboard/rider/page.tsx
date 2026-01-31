import { Booking } from "@/components/pages/dashboard/rider/booking";
import { AvailableRide } from "@/components/pages/dashboard/rider/available-ride";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";

export default function BookServicePage() {
  return (
    <div className="container mx-auto space-y-6 ">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Rider Requests" },
        ]}
      />
      {/* <PageHeader
        title="Book Services"
        description="Where would you like to go to?"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Route Finder" },
        ]}
      /> */}

      <div className="flex flex-col-reverse gap-6 overflow-x-auto lg:flex-row">
        {/* Hide AvailableRide on mobile when vehicle is selected (it will be on separate page) */}
        <div className="hidden lg:block">
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse rounded-lg bg-muted lg:w-80" />
            }
          >
            <AvailableRide />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          <Suspense fallback={""}>
            <Booking />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
