"use client";
import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { BaseTable } from "@/components/shared/table/table-style";
import { useState } from "react";
import { SearchFilter } from "@/components/shared/dashboard/search-fliter";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { UsersResponse } from "@/_lib/type/auth/users";
import { getallAdmin } from "@/_lib/api/admin/users/user";
import { useQuery } from "@tanstack/react-query";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import AdminSignupModal from "./createAdmin";
export function AllAdminTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: Admins,
    isPending,
    isError,
    error: Error,
  } = useQuery<UsersResponse>({
    queryFn: getallAdmin,
    queryKey: ["AllAdmins"],
    refetchInterval: 60 * 1000, // 2 minutes
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
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
          <DropdownMenuItem>Edit User</DropdownMenuItem>
          <DropdownMenuItem>Suspend user</DropdownMenuItem>
          <DropdownMenuItem>User Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageHeader2
          title="Admins"
          actions={
            <>
              <Button onClick={() => setIsModalOpen(true)}>Create Admin</Button>
            </>
          }
        />
        <Suspense>
          <SearchFilter
            placeholder="Search admins..."
            className="bg-[#FAFBFD] rounded-md shadow-[0px_4px_4px_0px_#00000040] px-4 py-2"
            paramName={"admin"}
          />
        </Suspense>
      </div>
      {!isPending && isError && (
        <div className="text-red-500">{Error.message} </div>
      )}
      {!isPending && Admins?.count === 0 && (
        <div className="text-red-500">No Admin User</div>
      )}
      {!isPending && !isError && Admins.count > 0 && (
        <BaseTable
          columns={[
            { key: "name", label: "Name" },
            // { key: "id", label: "User ID" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "role", label: "Role" },
            {
              key: "createdAt",
              label: "Date Created",
              render: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={Admins.users}
          count={Admins.count}
          showCountBadge={true}
          rowActions2={RowActions}
        />
      )}
      <AdminSignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
