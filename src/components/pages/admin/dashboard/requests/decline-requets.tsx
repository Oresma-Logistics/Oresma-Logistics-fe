"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
interface Props {
  id: string;
}
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { AdminDelcineRequest } from "@/_lib/api/admin/decline-requests";

import { showToast } from "@/components/shared/toast";

export function DeclineRequest({ id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [Error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AdminDelcineRequest,
    mutationKey: ["AdminDeclineRequest"],
    onSuccess: (data) => {
      showToast.success("Request Declined", data.message);
      queryClient.invalidateQueries({
        queryKey: ["AdminRideRequest"],
      });
    },
    onError(error) {
      showToast.error("Failed to decline", error.message);
    },
  });
  const Cancel = () => {
    setIsOpen(false);
  };
  const Continue = async () => {
    if (!declineReason) {
      setError("Please State the reason for this decline");
      return;
    }

    setError("");
    await mutation.mutateAsync({ id: id, reason: declineReason });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Decline
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AlertDialogHeader className="text-primaryT  rounded-t-lg flex flex-col items-start justify-between py-4">
          <div className="flex-1">
            <AlertDialogTitle className="text-2xl">
              Decline this Requests
            </AlertDialogTitle>
            <AlertDialogDescription className="text-primaryT/80">
              Are you sure you want to decline this ride request
            </AlertDialogDescription>
          </div>
          <div className="mt-4 w-full">
            <AlertDialogTitle className="text-base! text-abodeBlack">
              Reason for Decline
            </AlertDialogTitle>
            {Error && <p className="text-red-500">{Error}</p>}
            <div className="mt-4 w-full">
              <Textarea
                placeholder="Please provide a reason for declining this transaction..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="min-h-[100px] w-full"
              />
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={Cancel} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={Continue}
            className="cursor-pointer"
            disabled={mutation.isPending || mutation.isSuccess}
          >
            {mutation.isPending ? "Declining....." : " Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
