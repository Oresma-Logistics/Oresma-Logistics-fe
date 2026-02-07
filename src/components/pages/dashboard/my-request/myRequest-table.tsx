"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyRequest, cancelUserRideRequest } from "@/_lib/api/dashboard/rider/ride-request";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { AllUserRequests } from "@/_lib/type/request/user-request";
import { BaseTable } from "@/components/shared/table/table-style";
import { StatusBadge } from "@/components/shared/dashboard/status-card";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/shared/toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MyRequestTable() {
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  
  const {
    data: AllUserRequest,
    isPending,
    isError,
    error: Error,
  } = useQuery<AllUserRequests>({
    queryFn: getMyRequest,
    queryKey: ["UserRequests"],
  });

  const cancelMutation = useMutation({
    mutationFn: ({ rideRequestId, payload }: { rideRequestId: string; payload: { reason?: string; note?: string } }) =>
      cancelUserRideRequest(rideRequestId, payload),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Request Cancelled", data.message || "Your ride request has been cancelled successfully");
        queryClient.invalidateQueries({ queryKey: ["UserRequests"] });
        setCancelDialogOpen(false);
        setReason("");
        setNote("");
        setSelectedRequestId(null);
      } else {
        showToast.error("Error", data.message || "Failed to cancel request");
      }
    },
    onError: (error: Error) => {
      showToast.error("Error", error.message || "Failed to cancel request. Please try again.");
    },
  });

  const handleCancelClick = (rideRequestId: string) => {
    setSelectedRequestId(rideRequestId);
    setCancelDialogOpen(true);
  };

  // TODO: Replace with your payment API call when ready
  const handleMakePayment = (rideRequestId: string) => {
    // e.g. open payment URL, call payment API, etc.
    showToast.success("Make payment", "Payment flow will be connected here.");
  };

  // TODO: Replace with your notify-rider endpoint when ready
  const handleNotifyRider = (rideRequestId: string) => {
    showToast.success("Notify rider", "Endpoint will be connected here.");
  };

  const handleCancelConfirm = () => {
    if (!selectedRequestId) {
      showToast.error("Error", "Request ID is missing");
      return;
    }
    const payload: { reason?: string; note?: string } = {};
    if (reason.trim()) {
      payload.reason = reason.trim();
    }
    if (note.trim()) {
      payload.note = note.trim();
    }
    cancelMutation.mutate({
      rideRequestId: selectedRequestId,
      payload,
    });
  };

  // Determine if a request can be cancelled
  const canCancel = (status: string) => {
    const cancellableStatuses = ["pending", "payment_failed", "assigned"];
    return cancellableStatuses.includes(status.toLowerCase());
  };
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
        {/* Cancel Request Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cancel Ride Request</DialogTitle>
              <DialogDescription>
                Please provide a reason and note for cancelling this request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Changed pickup location"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={cancelMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="e.g., Will create a new request"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={cancelMutation.isPending}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCancelDialogOpen(false);
                  setReason("");
                  setNote("");
                  setSelectedRequestId(null);
                }}
                disabled={cancelMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelConfirm}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
          rowActions2={(row) => {
            const isPending = row.status?.toLowerCase() === "pending";
            const isPaymentSuccess = row.status?.toLowerCase() === "payment_success";
            const showCancel = canCancel(row.status);
            if (!isPending && !isPaymentSuccess && !showCancel) return null;
            return (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {isPending && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakePayment(row._id);
                    }}
                    className="shrink-0"
                  >
                    Make payment
                  </Button>
                )}
                {isPaymentSuccess && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotifyRider(row._id);
                    }}
                    className="shrink-0"
                  >
                    Notify rider
                  </Button>
                )}
                {showCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelClick(row._id);
                    }}
                    disabled={cancelMutation.isPending}
                    className="shrink-0"
                  >
                    {cancelMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Request"
                    )}
                  </Button>
                )}
              </div>
            );
          }}
          //   onRowClick={(row) =>
          //     navigate.push(`/dashboard/my-requests/${row._id}`)
          //   }
        />
      </div>
    );
  }
}
