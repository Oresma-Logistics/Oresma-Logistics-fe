"use client";
import { useQuery } from "@tanstack/react-query";
import { getMyRequest } from "@/_lib/api/dashboard/rider/ride-request";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { AllUserRequests } from "@/_lib/type/request/user-request";
import { BaseTable } from "@/components/shared/table/table-style";
import { StatusBadge } from "@/components/shared/dashboard/status-card";

export default function MyRequestTable() {
  const {
    data: AllUserRequest,
    isPending,
    isError,
    error: Error,
  } = useQuery<AllUserRequests>({
    queryFn: getMyRequest,
    queryKey: ["UserRequests"],
  });
  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    if (isError) {
      return <div>{Error.message} </div>;
    }
  }

  if (!isPending && !isError && AllUserRequest.count === 0) {
    return <div className="text-red-500">No Assignment Requests</div>;
  }

  if (!isPending && !isError && AllUserRequest.count > 0) {
    return (
      <div>
        <BaseTable
          columns={[
            { key: "vehicleType", label: "Vehicle type" },
            {
              key: "riderName",
              label: "Rider Name",
              render(_value, row) {
                const riderName = row.riderId?.userId?.name;
                return riderName ? riderName : <span className="text-muted-foreground">Not Assigned</span>;
              },
            },
            {
              key: "riderPhone",
              label: "Rider Phone",
              render(_value, row) {
                const riderPhone = row.riderId?.userId?.phone;
                return riderPhone ? riderPhone : <span className="text-muted-foreground">-</span>;
              },
            },
            { key: "pickup.address", label: "Pick up location" },
            { key: "dropoff.address", label: "Final destination" },
            {
              key: "pricing.total",
              label: "Total fee",
              render(value, row) {
                return (
                  <div>
                    {" "}
                    {`${row.pricing.currency === "NGN" ? "₦" : "$"} ${
                      row.pricing.total
                    }`}
                  </div>
                );
              },
            },
            { key: "referenceCode", label: "Reference Code" },
            {
              key: "status",
              label: "Status",
              render(value) {
                return <StatusBadge status={value} />;
              },
            },
            { key: "createdAt", label: "Date Created" },
          ]}
          data={AllUserRequest.rideRequests}
          count={AllUserRequest.count}
          showCountBadge={true}
          //   onRowClick={(row) =>
          //     navigate.push(`/dashboard/my-requests/${row._id}`)
          //   }
        />
      </div>
    );
  }
}
