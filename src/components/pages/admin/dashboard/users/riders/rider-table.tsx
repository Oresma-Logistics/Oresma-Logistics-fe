"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { BaseTable } from "@/components/shared/table/table-style";
import { MoreVertical, User } from "lucide-react";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { SearchFilter } from "@/components/shared/dashboard/search-fliter";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";

import RiderSignupModal from "./create-rider-form";
import { RiderDetailsModal } from "./rider-details-modal";
import { RidersResponse, Rider } from "@/_lib/type/auth/users";
import { getallRider, deleteRider, updateUserState } from "@/_lib/api/admin/users/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { showToast } from "@/components/shared/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { nigerianStates } from "@/_lib/data/nigerian-states";

export function AllRidersTable() {
  const queryClient = useQueryClient();
  const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [riderToDelete, setRiderToDelete] = useState<string | null>(null);
  const [editStateDialogOpen, setEditStateDialogOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  
  const {
    data: Riders,
    isPending,
    isError,
    error: Error,
  } = useQuery<RidersResponse>({
    queryFn: getallRider,
    queryKey: ["AllRiders"],
    refetchInterval: 60 * 1000, // 1 minutes
    refetchOnReconnect: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRider,
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("Rider Deleted", data.message || "Rider has been deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["AllRiders"] });
        setDeleteDialogOpen(false);
        setRiderToDelete(null);
      } else {
        showToast.error("Error", data.message || "Failed to delete rider");
      }
    },
    onError: (error: Error) => {
      showToast.error("Error", error.message || "Failed to delete rider. Please try again.");
    },
  });

  const updateStateMutation = useMutation({
    mutationFn: ({ userId, state }: { userId: string; state: string }) =>
      updateUserState(userId, { state }),
    onSuccess: (data) => {
      if (data.success) {
        showToast.success("State Updated", data.message || "Rider state has been updated successfully");
        queryClient.invalidateQueries({ queryKey: ["AllRiders"] });
        setEditStateDialogOpen(false);
        setSelectedUserId(null);
        setSelectedState("");
      } else {
        showToast.error("Error", data.message || "Failed to update state");
      }
    },
    onError: (error: Error) => {
      showToast.error("Error", error.message || "Failed to update state. Please try again.");
    },
  });

  const handleDeleteClick = (riderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRiderToDelete(riderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (riderToDelete) {
      deleteMutation.mutate(riderToDelete);
    }
  };

  const handleEditStateClick = (userId: string, currentState: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUserId(userId);
    setSelectedState(currentState || "");
    setEditStateDialogOpen(true);
  };

  const handleStateUpdate = () => {
    if (selectedUserId && selectedState) {
      updateStateMutation.mutate({ userId: selectedUserId, state: selectedState });
    }
  };

  if (isPending) {
    return <SkeletonCardList />;
  }

  const RowActions = (row: Rider) => {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem>Edit Rider</DropdownMenuItem>
            <DropdownMenuItem>Suspend Rider</DropdownMenuItem>
            <DropdownMenuItem>Rider Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleEditStateClick(row.userId?._id || "", (row.userId as { state?: string })?.state, e)}
            >
              Edit Rider State
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => handleDeleteClick(row._id, e)}
            >
              Delete Rider
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageHeader2
          title="All Riders"
          actions={
            <>
              <Button
                onClick={() => {
                  setOpenRegisterModal(true);
                }}
              >
                Add Rider
              </Button>
              <Suspense>
                <PeriodSelector
                  options={[
                    { label: "All Gender", value: "all" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  paramName="gender"
                  defaultValue="all"
                  icon={<User className="h-4 w-4 text-gray-500" />}
                  selectedClassName="bg-primaryT text-white"
                />
              </Suspense>
            </>
          }
        />
        <Suspense>
          <SearchFilter
            paramName="riderName"
            placeholder="Search riders..."
            className="bg-[#FAFBFD] rounded-md shadow-[0px_4px_4px_0px_#00000040] px-4 py-2"
          />
        </Suspense>
      </div>
      {!isPending && isError && (
        <div className="text-red-500">No Rider User</div>
      )}
      {!isPending && Riders?.count === 0 && (
        <div className="text-red-500">No Rider User</div>
      )}
      {!isPending && !Error && Riders && Riders.count > 0 && (
        <BaseTable
          columns={[
            { 
              key: "name", 
              label: "Name",
              render: (_, rider) => rider.userId?.name || "N/A"
            },
            { 
              key: "email", 
              label: "Email",
              render: (_, rider) => rider.userId?.email || "N/A"
            },
            { 
              key: "phone", 
              label: "Phone",
              render: (_, rider) => rider.userId?.phone || "N/A"
            },
            { 
              key: "role", 
              label: "Role",
              render: (_, rider) => rider.userId?.role || "rider"
            },
            {
              key: "createdAt",
              label: "Date Created",
              render: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={Riders.riders}
          showCountBadge={true}
          count={Riders.count}
          rowActions2={RowActions}
          onRowClick={(rider) => {
            setSelectedRider(rider);
            setOpenDetailsModal(true);
          }}
        />
      )}
      
      {/* Edit State Dialog */}
      <Dialog open={editStateDialogOpen} onOpenChange={setEditStateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Rider State</DialogTitle>
            <DialogDescription>
              Select a new state for this rider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditStateDialogOpen(false);
                setSelectedUserId(null);
                setSelectedState("");
              }}
              disabled={updateStateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStateUpdate}
              disabled={updateStateMutation.isPending || !selectedState}
            >
              {updateStateMutation.isPending ? "Updating..." : "Update State"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rider</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rider? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RiderSignupModal
        isOpen={openRegisterModal}
        onClose={() => {
          setOpenRegisterModal(false);
        }}
      />
      <RiderDetailsModal
        open={openDetailsModal}
        onOpenChange={setOpenDetailsModal}
        rider={selectedRider}
      />
    </div>
  );
}
