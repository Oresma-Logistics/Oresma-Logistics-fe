import { AdminWithdrawalRequests } from "@/components/pages/admin/dashboard/withdrawal/all-withdrawal-requests";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";
import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { ListFilterIcon } from "lucide-react";
import { Suspense } from "react";
export default function AdminWithdrawHistory() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "All Withdrawal Requests" },
        ]}
      />
      <PageHeader2
        title="Withdrawals"
        actions={
          <>
            <Suspense fallback={""}>
              <PeriodSelector
                selectedClassName=" bg-primaryT/90 text-white"
                defaultValue=""
                paramName="status"
                icon={<ListFilterIcon className="h-4 w-4 text-gray-500" />}
                options={[
                  { label: "All Status", value: "" },
                  { label: "Approved", value: "approved" },
                  { label: "Awaiting", value: "awaiting_payment" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
              />
            </Suspense>
          </>
        }
      />
      <Suspense fallback={""}>
        <AdminWithdrawalRequests />
      </Suspense>
    </div>
  );
}
