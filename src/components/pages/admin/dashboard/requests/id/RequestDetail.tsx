"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { DeclineRequest } from "../decline-requets";

import { SingleRiderRequest } from "@/_lib/api/rider/assignment";
import { useQuery } from "@tanstack/react-query";

import { SingleRideRequestResponse } from "@/_lib/type/request/rider-request";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import RequestDetailWrapper from "@/components/shared/dashboard/singleRequestDetails/requestDetailWrapper";
import CreateInoiveModal from "../invoiceCreateModal";
import { ReassignRiderModal } from "../reassign-rider-modal";

export function AdminReqestsDetail({ id }: { id: string }) {
  const [openModal, setOpenModal] = useState(false);
  const [openReassignModal, setOpenReassignModal] = useState(false);

  const {
    data,
    isError,
    isPending,
    error: Error,
  } = useQuery<SingleRideRequestResponse>({
    queryKey: ["Single Request", id],
    queryFn: () => SingleRiderRequest(id),
    refetchInterval: 60 * 1000,
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
        {(data.rideRequest.status === "pending" ||
          data.rideRequest.status === "payment_failed") && (
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => {
                setOpenModal(true);
              }}
            >
              {data.rideRequest.invoiceSent
                ? "Resend Invoice"
                : "Create Invoice"}
            </Button>
            <DeclineRequest id={id} />
            <Button
              onClick={() => {
                setOpenReassignModal(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Reassign Rider
            </Button>
          </div>
        )}
        <CreateInoiveModal
          open={openModal}
          onOpenChange={() => {
            setOpenModal(false);
          }}
          id={id}
        />
        <ReassignRiderModal
          open={openReassignModal}
          onOpenChange={setOpenReassignModal}
          requestId={id}
        />
      </RequestDetailWrapper>
    );
  }
}
