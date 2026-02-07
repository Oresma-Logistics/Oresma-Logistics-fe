"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SingleRideRequestResponse } from "@/_lib/type/request/rider-request";
import { SingleRiderRequest } from "@/_lib/api/rider/assignment";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { RouteProcess } from "./adminProcessingModal";

import MapRoute from "@/components/shared/dashboard/singleRequestDetails/mapDisplay";

import { StatusBadge } from "@/components/shared/dashboard/status-card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

import Cookies from "js-cookie";
import { User } from "@/_lib/type/cookies";
import { EndProcess } from "./decline-this-activeRequest";
import { StartProcess } from "./start-trip";
export interface Stop {
  id: number;
  label: string;
  location: string;
  address: string;
  time?: string;
  buttonLabel: string;
  buttonVariant?: "default" | "outline" | "third";
  onAction?: () => void;
  process: "pending" | "success";
}

export function TripProcess({ id }: { id: string }) {
  const [openModal, setOpenModal] = useState(false);
  const [isDialog, setDialog] = useState(false);
  const [secretCodeDialog, setSecretCodeDialog] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const rawUser = Cookies.get("user");
  const userData: User | null = rawUser ? JSON.parse(rawUser) : null;

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
  const navigate = useRouter();
  // const StartProcess = () => {
  //   const muataion = useMutation({
  //     mutationFn: StartAssignmentRequest,
  //     mutationKey: ["startAssignment"],
  //     onSuccess: (data) => {
  //       showToast.success("Trip has Started", data.message);
  //     },
  //     onError: (error) => {
  //       showToast.error("Failed to start trip", error.message);
  //     },
  //   });

  //   const handleClick = async () => {
  //     await muataion.mutateAsync(id);
  //   };

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-center cursor-pointer">
  //         <Button
  //           onClick={handleClick}
  //           disabled={muataion.isPending}
  //           className="cursor-pointer"
  //         >
  //           {muataion.isPending ? "Starting Trip...." : "Start Trip"}
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };
  // const EndProcess = () => {
  //   const muataion = useMutation({
  //     mutationFn: DeclineAssignmentRequest,
  //     mutationKey: ["startAssignment"],
  //     onSuccess: (data) => {
  //       showToast.success("Trip has been Declined", data.message);
  //       navigate.push("/rider/dashboard/activeRequest");
  //     },
  //     onError: (error) => {
  //       showToast.error("Failed to Decline Reuqest", error.message);
  //     },
  //   });

  //   const handleClick = async () => {
  //     await muataion.mutateAsync(id);
  //   };

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-center cursor-pointer">
  //         <Button
  //           onClick={handleClick}
  //           disabled={muataion.isPending}
  //           className="cursor-pointer"
  //         >
  //           {muataion.isPending ? "Declining Trip...." : "Decline Trip"}
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // };
  const FinshProcess = () => {
    return (
      // <div className="space-y-6">
      //   <div className="flex justify-center cursor-pointer">
      //     <Button
      //       onClick={() => {
      //         setOpenModal(true);
      //       }}
      //       className="cursor-pointer"
      //     >
      //       Finish Trip
      //     </Button>
      //   </div>
      // </div>
      <AlertDialog open={isDialog} onOpenChange={setDialog}>
        <AlertDialogTrigger asChild>
          <Button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Finish Trip
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
                Finish this Trip
              </AlertDialogTitle>
              <AlertDialogDescription className="text-primaryT/80">
                Are you sure you want to Finish this trip
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialog(false);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialog(false);
                setSecretCodeDialog(true);
              }}
              className="cursor-pointer"
            >
              Finish Trip
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
      <div>
        <MapRoute
          origin={data.rideRequest.pickup.address}
          destination={data.rideRequest.dropoff.address}
          topActions={
            <div className="flex flex-wrap items-center gap-2">
              {data.rideRequest.status === "assigned" && <StartProcess id={id} />}
              {data.rideRequest.status !== "completed" &&
                data.rideRequest.status !== "in-progress" && (
                  <EndProcess id={id} />
                )}
            </div>
          }
        />
        <div className="w-full max-md:max-w-2xl mx-auto  bg-card rounded-lg border border-border p-6 -mt-12 z-5 relative">
          {/* Driver Profile Section */}
          <div className="flex items-center gap-8 mb-8 pb-6 border-b border-border sm:flex-row flex-col">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={userData?.name || "RiderS"}
              />
              <AvatarFallback>
                {userData?.name.charAt(0) || "Rider".charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-3 gap-4 ">
              <div className="flex flex-col gap-2 justify-center">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Pickup location
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {data.rideRequest.pickup.address}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Current location
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground"></p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Destination
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    {data.rideRequest.dropoff.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {" "}
                <StatusBadge status={data.rideRequest.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            {data.rideRequest.status === "in-progress" && <FinshProcess />}
            {data.rideRequest.status === "completed" && (
              <div className="space-y-6">
                <div className="flex justify-center cursor-pointer">
                  <Button
                    onClick={() => {
                      navigate.push("/rider/dashboard/activeRequests");
                    }}
                    className="cursor-pointer"
                  >
                    Back to Active Requests
                  </Button>
                </div>
              </div>
            )}
          </div>
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
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSecretCodeDialog(false);
                    setSecretCode("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (secretCode.length === 4) {
                      setSecretCodeDialog(false);
                      setOpenModal(true);
                    }
                  }}
                  disabled={secretCode.length !== 4}
                >
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <RouteProcess
            open={openModal}
            onOpenChange={() => {
              setOpenModal(false);
              setSecretCode("");
            }}
            id={id}
            secretCode={secretCode}
          />
        </div>
      </div>
    );
  }
}
