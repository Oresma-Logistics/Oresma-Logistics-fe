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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RequestTable() {
  const queryClient = useQueryClient();
  const [secretCodeDialog, setSecretCodeDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [secretCode, setSecretCode] = useState("");
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

  const endTripMutation = useMutation({
    mutationFn: ({ id, secretCode }: { id: string; secretCode: string }) =>
      FinishAssignmentRequest(id, secretCode),
    mutationKey: ["FinishAssignment"],
    onSuccess: async () => {
      showToast.success("Trip ended successfully");
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["AvaliableRides"],
      });
      if (selectedRequestId) {
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", selectedRequestId],
        });
      }
      setSecretCodeDialog(false);
      setSelectedRequestId(null);
      setSecretCode("");
    },
    onError() {
      showToast.error("Failed to End Trip");
    },
  });

  const EndTrip = ({ id }: { id: string }) => {
    const handlerSubmit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedRequestId(id);
      setSecretCodeDialog(true);
    };

    return (
      <Button
        onClick={handlerSubmit}
        className="cursor-pointer"
        disabled={endTripMutation.isPending}
      >
        {endTripMutation.isPending ? "Ending Trip..." : "End Trip"}
      </Button>
    );
  };

  const RowActions = ({ row }: { row: RideRequest }) => {
    const router = useRouter();
    if (row.status === "cancelled") return null;
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

  const handleConfirmFinish = () => {
    if (selectedRequestId && secretCode.length === 4) {
      endTripMutation.mutate({ id: selectedRequestId, secretCode });
    }
  };

  return (
    <div>
      <BaseTable
        columns={[
          { key: "vehicleType", label: "Vehicle type" },
          {
            key: "pricing.total",
            label: "Total",
            render: (value, row) => {
              const total = row?.pricing?.total;
              const currency = row?.pricing?.currency ?? "NGN";
              if (total == null || total === "") return "—";
              return `${currency === "NGN" ? "₦" : ""}${Number(total).toLocaleString()}`;
            },
          },
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

      {/* Secret Code Input Dialog */}
      <Dialog open={secretCodeDialog} onOpenChange={setSecretCodeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter Secret Code</DialogTitle>
            <DialogDescription>
              Please enter the 4-digit secret code to finish this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="secretCode">Secret Code</Label>
              <Input
                id="secretCode"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter 4-digit code"
                value={secretCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setSecretCode(value);
                }}
                className="text-center text-2xl tracking-widest"
                disabled={endTripMutation.isPending}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSecretCodeDialog(false);
                setSelectedRequestId(null);
                setSecretCode("");
              }}
              disabled={endTripMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmFinish}
              disabled={endTripMutation.isPending || secretCode.length !== 4}
            >
              {endTripMutation.isPending ? "Finishing..." : "Finish Trip"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
