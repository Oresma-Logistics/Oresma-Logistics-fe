"use client";

import { useState } from "react";
import { RiderProfileResponse } from "@/_lib/type/auth/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Star } from "lucide-react";
import { AddVehicleModal } from "./add-vehicle-modal";
import { StatusBadge2 } from "@/components/shared/dashboard/status-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function VehicleRiderProfile({
  rider,
}: {
  rider: RiderProfileResponse["rider"];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const motorcycles = rider.motorcycles || [];

  const getVerificationBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "approved") {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    }
    if (statusLower === "pending") {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    if (statusLower === "rejected") {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Vehicle Information
          </CardTitle>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Vehicle Type</span>
            <Badge variant="outline">
              {rider.vehicleInfo.vehicleType || "Not specified"}
            </Badge>
          </div>

          {motorcycles.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                My Vehicles ({motorcycles.length})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Verification Status</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motorcycles.map((motorcycle) => (
                      <TableRow key={motorcycle._id}>
                        <TableCell className="font-medium">
                          {motorcycle.licensePlate}
                        </TableCell>
                        <TableCell>
                          {getVerificationBadge(motorcycle.verificationStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {motorcycle.rating > 0
                                ? motorcycle.rating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No vehicles added yet. Click "Add Vehicle" to add your first vehicle.
            </p>
          )}
        </CardContent>
      </Card>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        riderId={rider._id}
      />
    </>
  );
}
