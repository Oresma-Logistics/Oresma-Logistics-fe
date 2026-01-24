"use client";

import { Button } from "@/components/ui/button";

import { SingleRideRequestResponse } from "@/_lib/type/request/rider-request";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SingleRiderRequest } from "@/_lib/api/rider/assignment";
import RequestDetailWrapper from "@/components/shared/dashboard/singleRequestDetails/requestDetailWrapper";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import {
  AcceptAssignmentRequest,
  FinishAssignmentRequest,
} from "@/_lib/api/rider/assignment";
import { showToast } from "@/components/shared/toast";
import { useRouter } from "next/navigation";
export function RequestDetail({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data,
    isError,
    isPending,
    error: Error,
  } = useQuery<SingleRideRequestResponse>({
    queryKey: ["Single Reques for Rider", id],
    queryFn: () => SingleRiderRequest(id),
  });

  const AcceptRequest = () => {
    const mutation = useMutation({
      mutationFn: AcceptAssignmentRequest,
      mutationKey: ["AcceptAssignment"],
      onSuccess: async (data) => {
        showToast.success(data.message);
        // Invalidate and refetch the query to get updated status
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", id],
        });
        // Navigate to the request detail page after successful acceptance
        router.push(`/rider/dashboard/requests/${id}`);
      },
      onError: (error) => {
        showToast.error(error.message);
      },
    });

    const handlerSubmit = async () => {
      await mutation.mutateAsync(id);
    };

    return (
      <Button onClick={handlerSubmit} className="w-full cursor-pointer">
        Accept
      </Button>
    );
  };

  const EndTrip = () => {
    const mutation = useMutation({
      mutationFn: FinishAssignmentRequest,
      mutationKey: ["FinishAssignment"],
      onSuccess: async (data) => {
        showToast.success(data.message || "Trip ended successfully");
        // Invalidate and refetch the query to get updated status
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", id],
        });
      },
      onError: (error) => {
        showToast.error(error.message);
      },
    });

    const handlerSubmit = async () => {
      await mutation.mutateAsync(id);
    };

    return (
      <Button
        onClick={handlerSubmit}
        className="w-full cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Ending Trip..." : "End Trip"}
      </Button>
    );
  };

  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    return <div className="text-red-500">{Error.message}</div>;
  }

  if (!isPending && !isError) {
    return (
      <RequestDetailWrapper request={data.rideRequest}>
        {data.rideRequest.status !== "assigned" &&
          data.rideRequest.status !== "in-progress" &&
          data.rideRequest.status !== "completed" && (
            <div>
              <div>
                <AcceptRequest />
              </div>
            </div>
          )}
        {data.rideRequest.status === "assigned" && (
          <div>
            <Button
              onClick={() => {
                router.push(`/rider/dashboard/activeRequests/${id}/route`);
              }}
              className="w-full cursor-pointer"
            >
              Start Trip
            </Button>
          </div>
        )}
        {data.rideRequest.status === "in-progress" && (
          <div>
            <EndTrip />
          </div>
        )}
      </RequestDetailWrapper>
    );
  }
}
export function RequestDetail2({ id }: { id: string }) {
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const {
    data,
    isError,
    isPending,
    error: Error,
  } = useQuery<SingleRideRequestResponse>({
    queryKey: ["Single Reques for Rider", id],
    queryFn: () => SingleRiderRequest(id),
    refetchInterval: 5000,
  });

  const EndTrip = () => {
    const mutation = useMutation({
      mutationFn: FinishAssignmentRequest,
      mutationKey: ["FinishAssignment"],
      onSuccess: async (data) => {
        showToast.success(data.message || "Trip ended successfully");
        // Invalidate and refetch the query to get updated status
        await queryClient.invalidateQueries({
          queryKey: ["Single Reques for Rider", id],
        });
      },
      onError: (error) => {
        showToast.error(error.message);
      },
    });

    const handlerSubmit = async () => {
      await mutation.mutateAsync(id);
    };

    return (
      <Button
        onClick={handlerSubmit}
        className="w-full cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Ending Trip..." : "End Trip"}
      </Button>
    );
  };

  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    return <div className="text-red-500">{Error.message}</div>;
  }

  if (!isPending && !isError) {
    return (
      <RequestDetailWrapper request={data.rideRequest}>
        {data.rideRequest.status === "assigned" && (
          <div>
            <Button
              onClick={() => {
                navigate.push(`/rider/dashboard/activeRequests/${id}/route`);
              }}
              className="w-full cursor-pointer"
            >
              Start Trip
            </Button>
          </div>
        )}
        {data.rideRequest.status === "in-progress" && (
          <div>
            <EndTrip />
          </div>
        )}
      </RequestDetailWrapper>
    );
  }
}
