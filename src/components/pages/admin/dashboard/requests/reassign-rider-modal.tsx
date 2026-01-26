"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getallRider } from "@/_lib/api/admin/users/user";
import { RidersResponse, Rider } from "@/_lib/type/auth/users";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { User, Loader2 } from "lucide-react";
import { showToast } from "@/components/shared/toast";
import { reassignRiderToRequest } from "@/_lib/api/admin/reassign-rider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  onRiderSelect?: (riderId: string) => void;
}

export function ReassignRiderModal({ open, onOpenChange, requestId, onRiderSelect }: Props) {
  const queryClient = useQueryClient();
  
  const {
    data: ridersData,
    isPending,
    isError,
    error,
  } = useQuery<RidersResponse>({
    queryFn: getallRider,
    queryKey: ["AllRiders"],
    enabled: open, // Only fetch when modal is open
  });

  const reassignMutation = useMutation({
    mutationFn: (riderId: string) =>
      reassignRiderToRequest(requestId, { riderId }),
    onSuccess: (data) => {
      showToast.success(
        "Rider Reassigned",
        data.message || "Rider has been successfully reassigned"
      );
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["Single Request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["AdminRideRequest"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      showToast.error("Reassignment Failed", error.message);
    },
  });

  const handleRiderSelect = (rider: Rider) => {
    if (onRiderSelect) {
      onRiderSelect(rider._id);
      onOpenChange(false);
    } else {
      // Call the reassign API
      reassignMutation.mutate(rider._id);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!reassignMutation.isPending) {
          onOpenChange(newOpen);
        }
      }}
    >
      {/* <DialogTitle>Reassign Rider</DialogTitle> */}
      <DialogContent
        className="max-h-[90%] overflow-auto max-w-2xl"
        onInteractOutside={(e) => {
          if (reassignMutation.isPending) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (reassignMutation.isPending) {
            e.preventDefault();
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Select a Rider</h3>
            <p className="text-sm text-muted-foreground">
              Choose a rider to reassign this request to
            </p>
            {reassignMutation.isPending && (
              <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reassigning rider...</span>
              </div>
            )}
          </div>

          {isPending && (
            <div className="py-8">
              <SkeletonCardList />
            </div>
          )}

          {isError && (
            <div className="py-8 text-center">
              <p className="text-red-500">
                {error instanceof Error ? error.message : "Failed to load riders"}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}

          {!isPending && !isError && ridersData && (
            <div className="space-y-2">
              {ridersData.riders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No riders available</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {ridersData.riders.map((rider) => (
                    <div
                      key={rider._id}
                      className={`border rounded-lg p-4 transition-colors ${
                        reassignMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted/50 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!reassignMutation.isPending) {
                          handleRiderSelect(rider);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {rider.userId?.name || "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {rider.userId?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {rider.userId?.phone || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                rider.isAvailable
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {rider.isAvailable ? "Available" : "Unavailable"}
                            </span>
                            {rider.vehicleInfo && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                {rider.vehicleInfo.vehicleType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {rider.rating > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Rating: {rider.rating.toFixed(1)} • {rider.totalDeliveries} deliveries
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={reassignMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
