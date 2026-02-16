import { PageHeader2 } from "@/components/shared/headers/page-headers";
import TotalSales from "@/components/pages/rider/dashbord/totalSales";
import { UpdateLocationButton } from "@/components/pages/rider/dashbord/update-location-button";
import { IncomingRequestButton } from "@/components/pages/rider/dashbord/incoming-request-button";
import { StatCard } from "@/components/shared/dashboard/stats-card";
import { Menu, CalendarArrowDown } from "lucide-react";
import { RecentTrip } from "@/components/pages/rider/dashbord/recentTrip";
import { RegisteredVehicle } from "@/components/pages/rider/dashbord/registeredVehicle";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <PageHeader2
        title="Dashboard"
        actions={
          <>
            <UpdateLocationButton />
            <IncomingRequestButton />
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
