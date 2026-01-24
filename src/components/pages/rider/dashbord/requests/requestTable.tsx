"use client";
import {
  BaseTable,
  // type RowAction,
} from "@/components/shared/table/table-style";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AcceptAssignmentRequest,
  FinishAssignmentRequest,
  getAvalialeRequest,
} from "@/_lib/api/rider/assignment";
import { AssignmentRequests } from "@/_lib/type/request/rider-assignment";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/_lib/type/request/rider-request";
import { StatusBadge } from "@/components/shared/dashboard/status-card";
import { showToast } from "@/components/shared/toast";

export function RequestTable() {
  const queryClient = useQueryClient();
  const {
    data: AssignmentRequest,
    isPending,
    isError,
    error: Error,
  } = useQuery<AssignmentRequests>({
    queryFn: getAvalialeRequest,
    queryKey: ["AvaliableRides"],
    refetchInterval: 5000, // 5 Seconds
  });

  const AcceptRequest = ({ id }: { id: string }) => {
    const router = useRouter();
    const mutation = useMutation({
      mutationFn: AcceptAssignmentRequest,
      mutationKey: ["AcceptAssignment"],
      onSuccess: async () => {
        showToast.success("Request Accepted");
        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: ["AvaliableRides"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", id],
        });
        // Navigate to the request detail page after successful acceptance
        router.push(`/rider/dashboard/requests/${id}`);
      },
      onError() {
        showToast.error("Failed to Accept Request");
      },
    });

    const handlerSubmit = async () => {
      await mutation.mutateAsync(id);
    };

    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handlerSubmit();
        }}
        className="cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Accepting..." : "Accept"}
      </Button>
    );
  };

  const EndTrip = ({ id }: { id: string }) => {
    const mutation = useMutation({
      mutationFn: FinishAssignmentRequest,
      mutationKey: ["FinishAssignment"],
      onSuccess: async () => {
        showToast.success("Trip ended successfully");
        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: ["AvaliableRides"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", id],
        });
      },
      onError() {
        showToast.error("Failed to End Trip");
      },
    });

    const handlerSubmit = async () => {
      await mutation.mutateAsync(id);
    };

    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handlerSubmit();
        }}
        className="cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Ending Trip..." : "End Trip"}
      </Button>
    );
  };

  const RowActions = ({ row }: { row: RideRequest }) => {
    const router = useRouter();
    return (
      <div className="flex gap-1 sm:gap-2">
        {row.status !== "assigned" &&
          row.status !== "in-progress" &&
          row.status !== "completed" && <AcceptRequest id={row._id} />}
        {row.status === "assigned" && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/rider/dashboard/activeRequests/${row._id}/route`);
            }}
            className="cursor-pointer"
          >
            Start Trip
          </Button>
        )}
        {row.status === "in-progress" && <EndTrip id={row._id} />}
      </div>
    );
  };

  const navigate = useRouter();

  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    if (isError) {
      return <div>{Error.message} </div>;
    }
  }

  if (!isPending && AssignmentRequest?.count === 0) {
    return <div className="text-red-500">No Assignment Requests</div>;
  }

  return (
    <div>
      <BaseTable
        columns={[
          { key: "vehicleType", label: "Vehicle type" },
          { key: "_id", label: "Vehicle ID" },
          { key: "pickup.address", label: "Pick up location" },
          { key: "dropoff.address", label: "Final destination" },
          { key: "userId.name", label: "Customer" },
          {
            key: "invoiceSent",
            label: "Invoice Sent",
            render: (value) => (
              <div>
                {value ? (
                  <div className="text-green-500">Sent</div>
                ) : (
                  <div className="text-red-500">Not Sent</div>
                )}
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render(value) {
              return <StatusBadge status={value} />;
            },
          },
          { key: "createdAt", label: "Date Created" },
        ]}
        data={AssignmentRequest?.rideRequests}
        count={AssignmentRequest?.count}
        showCountBadge={true}
        // rowActions={RowActions}
        rowActions2={(row) => <RowActions row={row} />}
        onRowClick={(row) =>
          navigate.push(`/rider/dashboard/requests/${row._id}`)
        }
      />
    </div>
  );
}
