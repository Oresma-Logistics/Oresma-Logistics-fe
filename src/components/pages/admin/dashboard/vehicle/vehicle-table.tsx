"use client";
import { PeriodSelector } from "@/components/shared/dashboard/period-selector";
import { SearchFilter } from "@/components/shared/dashboard/search-fliter";
import { PageHeader2 } from "@/components/shared/headers/page-headers";
import { BaseTable } from "@/components/shared/table/table-style";
import { Car, MoreVertical } from "lucide-react";
import { CheckCircleIcon, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { findRiderTrucks } from "@/_lib/api/dashboard/rider/findRiderTrucks";
import { ResponseTrucks, Truck } from "@/_lib/type/trucks/trucks";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import CreateMotorcycleModal from "./create-motorcycle-form";
import AssignRiderModal from "./assign-rider-modal";
import { getAllMotorcycles } from "@/_lib/api/admin/motorcycle/get-all-motorcycles";
import { MotorcyclesResponse, Motorcycle } from "@/_lib/type/motorcycle/motorcycle";
import { useMemo } from "react";

type UnifiedVehicle = (Truck & { vehicleType: "truck" }) | (Motorcycle & { vehicleType: "motorcycle" });

export function VehicleDashboardTable() {
  const [openMotorcycleModal, setOpenMotorcycleModal] = useState<boolean>(false);
  const [openAssignRiderModal, setOpenAssignRiderModal] = useState<boolean>(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  const {
    data: lorriesData,
    isPending,
    error: Error,
    isError,
  } = useQuery<ResponseTrucks>({
    queryKey: ["AllTrucks"],
    queryFn: findRiderTrucks,
  });
  const {
    data: motorcyclesData,
    isPending: motorcyclesPending,
    error: motorcyclesError,
    isError: motorcyclesIsError,
  } = useQuery<MotorcyclesResponse>({
    queryKey: ["AllMotorcycles"],
    queryFn: getAllMotorcycles,
  });

  // Combine trucks and motorcycles into a unified array
  const allVehicles = useMemo<UnifiedVehicle[]>(() => {
    const trucks: UnifiedVehicle[] = (lorriesData?.trucks || []).map((truck) => ({
      ...truck,
      vehicleType: "truck" as const,
    }));
    const motorcycles: UnifiedVehicle[] = (motorcyclesData?.motorcycles || []).map((motorcycle) => ({
      ...motorcycle,
      vehicleType: "motorcycle" as const,
    }));
    return [...trucks, ...motorcycles];
  }, [lorriesData, motorcyclesData]);

  const totalCount = (lorriesData?.count || 0) + (motorcyclesData?.count || 0);
  const isLoading = isPending || motorcyclesPending;
  const hasError = isError || motorcyclesIsError;
  const errorMessage = Error?.message || motorcyclesError?.message;

  if (isLoading) {
    return <SkeletonCardList />;
  }
  const RowActions = (row: UnifiedVehicle) => {
    const handleAssignRider = () => {
      if (row.vehicleType === "motorcycle") {
        setSelectedMotorcycle(row as Motorcycle);
        setOpenAssignRiderModal(true);
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-3 py-2">
          {row.vehicleType === "motorcycle" && (
            <DropdownMenuItem onClick={handleAssignRider}>
              Assign Rider
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <PageHeader2
          title="Vehicles"
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => setOpenMotorcycleModal(true)}
              >
                Add Motorcycle
              </Button>
              <Button variant="default" asChild>
                <Link href="/admin/dashboard/vehicle/add-vehicle">
                  Add Vehicle
                </Link>
              </Button>
              <Suspense>
                <PeriodSelector
                  paramName="vehicle"
                  icon={<Car />}
                  options={[
                    { label: "All", value: "all" },
                    { label: "Car", value: "car" },
                    { label: "Bike", value: "bike" },
                    { label: "truck", value: "Truck" },
                    { label: "lorry", value: "Lorry" },
                  ]}
                  defaultValue="all"
                  selectedClassName="bg-primaryT text-white"
                />
              </Suspense>
            </>
          }
        />
        <Suspense>
          <SearchFilter
            paramName="vehicleName"
            placeholder="Search vehicles..."
            className="bg-[#FAFBFD] rounded-md shadow-[0px_4px_4px_0px_#00000040] px-4 py-2"
          />
        </Suspense>
      </div>

      {!hasError ? (
        totalCount === 0 ? (
          <div className="text-center py-8 text-gray-500">No Vehicles Found</div>
        ) : (
          <BaseTable
            columns={[
              {
                key: "vehicleType",
                label: "Vehicle Type",
                render: (value) => (
                  <span className="capitalize">{value === "motorcycle" ? "Motorcycle" : "Truck"}</span>
                ),
              },
              {
                key: "vehicleModel",
                label: "Vehicle Model",
                render: (value, row) => {
                  if (row.vehicleType === "motorcycle") {
                    const motorcycle = row as Motorcycle;
                    return motorcycle.vehicleModel || "N/A";
                  }
                  return value || "N/A";
                },
              },
              {
                key: "make",
                label: "Vehicle Make",
                render: (value) => value || "N/A",
              },
              {
                key: "licensePlate",
                label: "License Plate",
                render: (value) => value || "N/A",
              },
              {
                key: "truckType",
                label: "Type",
                render: (value, row) => {
                  if (row.vehicleType === "motorcycle") {
                    return "Motorcycle";
                  }
                  return value || "N/A";
                },
              },
              {
                key: "riderId",
                label: "Owner",
                render: (value, row) => {
                  if (row.vehicleType === "motorcycle") {
                    const motorcycle = row as Motorcycle & { vehicleType: "motorcycle" };
                    return motorcycle.riderId ? "Assigned" : "Unassigned";
                  }
                  // For trucks, check nested userId
                  if (row.vehicleType === "truck") {
                    const truck = row as Truck & { vehicleType: "truck" };
                    if (!truck.riderId) return "Unassigned";
                    // Handle both cases: userId as string or object
                    // Type assertion needed because API may return object despite type definition
                    const userId = truck.riderId.userId as string | { name?: string; email?: string } | undefined;
                    if (typeof userId === "object" && userId !== null && "name" in userId) {
                      return userId.name || userId.email || "Unassigned";
                    }
                    return "Assigned";
                  }
                  return "Unassigned";
                },
              },
              {
                key: "isVerified",
                label: "Verified",
                render: (value) =>
                  value ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ),
              },
            ]}
            data={allVehicles}
            showCountBadge={true}
            count={totalCount}
            rowActions2={RowActions}
          />
        )
      ) : (
        <div className="text-red-400">{errorMessage}</div>
      )}
      <CreateMotorcycleModal
        isOpen={openMotorcycleModal}
        onClose={() => setOpenMotorcycleModal(false)}
      />
      <AssignRiderModal
        isOpen={openAssignRiderModal}
        onClose={() => {
          setOpenAssignRiderModal(false);
          setSelectedMotorcycle(null);
        }}
        motorcycle={selectedMotorcycle}
      />
    </div>
  );
}
