"use client";

import { AvailableRide } from "@/components/pages/dashboard/rider/available-ride";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AvailableRidesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto space-y-6 px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Create Rider Requests", href: "/dashboard/rider" },
            { label: "Available Rides" },
          ]}
        />
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />
        }
      >
        <AvailableRide />
      </Suspense>
    </div>
  );
}
