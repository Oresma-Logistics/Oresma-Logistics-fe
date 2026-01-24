"use client";

import { Button } from "@/components/ui/button";

import { SingleRideRequestResponse } from "@/_lib/type/request/rider-request";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SingleRiderRequest } from "@/_lib/api/rider/assignment";
import RequestDetailWrapper from "@/components/shared/dashboard/singleRequestDetails/requestDetailWrapper";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { AcceptAssignmentRequest } from "@/_lib/api/rider/assignment";
import { showToast } from "@/components/shared/toast";
import { useRouter } from "next/navigation";
export function RequestDetail({ id }: { id: string }) {
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
      onSuccess: (data) => {
        showToast.success(data.message);
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
  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    return <div className="text-red-500">{Error.message}</div>;
  }

  if (!isPending && !isError) {
    return (
      <RequestDetailWrapper request={data.rideRequest}>
        {data.rideRequest.status !== "assigned" && (
          <div>
            <div>
              <AcceptRequest />
            </div>
          </div>
        )}
      </RequestDetailWrapper>
    );
  }
}
export function RequestDetail2({ id }: { id: string }) {
  const navigate = useRouter();
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

  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && isError) {
    return <div className="text-red-500">{Error.message}</div>;
  }

  if (!isPending && !isError) {
    return (
      <RequestDetailWrapper request={data.rideRequest}>
        {(data.rideRequest.status === "assigned" ||
          data.rideRequest.status === "in-progress") && (
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
      </RequestDetailWrapper>
    );
  }
}
