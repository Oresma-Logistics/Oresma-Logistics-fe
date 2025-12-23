import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { Button } from "@/components/ui/button";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import Link from "next/link";
import TotalSales from "@/components/pages/rider/dashbord/totalSales";
import { StatCard } from "@/components/shared/dashboard/stats-card";
import { Menu, CalendarArrowDown } from "lucide-react";
import { RecentTrip } from "@/components/pages/rider/dashbord/recentTrip";
import { RegisteredVehicle } from "@/components/pages/rider/dashbord/registeredVehicle";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <PageHeader2
        title="Dashboard"
        actions={
          <>
            <Suspense fallback={""}>
              <PeriodSelector
                options={[{ label: "30 Days", value: "30days" }]}
                paramName="riderDashboardFliter"
              />
            </Suspense>
            <Button className="rounded-full p-6 cursor-pointer" asChild>
              <Link href="/rider/dashboard/requests"> incoming Request</Link>
            </Button>
          </>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        <TotalSales />
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          <StatCard
            percentage
            value={0}
            label="Order rate"
            trend=""
            trendDirection="up"
            icon={<Menu className="w-5 h-5" />}
            gradient="organge"
          />
          <StatCard
            percentage
            value={0}
            label="Order rate"
            trend=""
            trendDirection="up"
            icon={<CalendarArrowDown className="w-5 h-5" />}
            gradient="organge"
          />
          <StatCard
            percentage
            value={0}
            label="Order rate"
            trend=""
            trendDirection="up"
            icon={<CalendarArrowDown className="w-5 h-5" />}
            gradient="organge"
          />
          <StatCard
            value={0}
            percentage
            label="Order rate"
            trend=""
            trendDirection="up"
            icon={<CalendarArrowDown className="w-5 h-5" />}
            gradient="organge"
          />
        </div>
        <RecentTrip />
        <RegisteredVehicle />
      </div>
    </div>
  );
}
