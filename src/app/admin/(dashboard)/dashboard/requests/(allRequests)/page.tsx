import { RequestsTable } from "@/components/pages/admin/dashboard/requests/truck/truckRequestsTable";
import { Suspense } from "react";
export default function AdminRequestsTable() {
  return (
    <div>
      <Suspense fallback={""}>
        <RequestsTable />
      </Suspense>
    </div>
  );
}
