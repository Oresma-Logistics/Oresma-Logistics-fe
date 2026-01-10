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
import { getallRider } from "@/_lib/api/admin/users/user";
import { useQuery } from "@tanstack/react-query";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";

export function AllRidersTable() {
  const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);
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
  if (isPending) {
    return <SkeletonCardList />;
  }

  const RowActions = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-3 py-2">
          <DropdownMenuItem>Edit Rider</DropdownMenuItem>
          <DropdownMenuItem>Suspend Rider</DropdownMenuItem>
          <DropdownMenuItem>Rider Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
