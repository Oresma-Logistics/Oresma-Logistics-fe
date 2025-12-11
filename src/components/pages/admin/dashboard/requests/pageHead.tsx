"use client";
import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { ListFilterIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { Suspense } from "react";
export function AdminRequestHeader() {
  const path = usePathname();
  // const RequestLink = [
  //   { label: "All requests", href: "/admin/dashboard/requests" },
  //   // { label: "Car  requests", href: "/admin/dashboard/requests/car" },
  //   // { label: "Bike requests", href: "/admin/dashboard/requests/bike" },
  //   {
  //     label: "Assigned Request",
  //     href: "/admin/dashboard/requests/assigned-riders",
  //   },
  // ];
  return (
    <PageHeader2
      title="All Requests"
      actions={
        <>
          {/* {RequestLink.map((link) => (
            <Button
              asChild
              key={link.label}
              className={`${
                path === link.href ? "bg-primaryT " : "bg-[#8B93A1]"
              } hover:bg-primaryT`}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))} */}
          <Suspense>
            <PeriodSelector
              selectedClassName=" bg-primaryT/90 text-white"
              defaultValue=""
              paramName="status"
              icon={<ListFilterIcon className="h-4 w-4 text-gray-500" />}
              options={[
                { label: "All Status", value: "" },
                { label: "Pending", value: "pending" },
                { label: "Payment Failed", value: "payment_failed" },
                { label: "Payment Success", value: "payment_success" },
                { label: "Assigned", value: "assigned" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />
          </Suspense>
          {/* <PeriodSelector
            selectedClassName=" bg-primaryT/90 text-white"
            defaultValue=""
            paramName="invoiceSent"
            icon={<ListFilterIcon className="h-4 w-4 text-gray-500" />}
            options={[
              { label: "All Invoices", value: "" },
              { label: "Invoice Not Sent", value: "false" },
              { label: "Invoice Sent", value: "true" },
            ]}
          /> */}
        </>
      }
    />
  );
}
