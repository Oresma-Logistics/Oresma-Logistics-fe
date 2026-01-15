"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { assignRiderToMotorcycle, AssignRiderPayload } from "@/_lib/api/admin/motorcycle/assign-rider";
import { showToast } from "@/components/shared/toast";
import { getallRider } from "@/_lib/api/admin/users/user";
import { RidersResponse } from "@/_lib/type/auth/users";
import { Motorcycle } from "@/_lib/type/motorcycle/motorcycle";

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  motorcycle: Motorcycle | null;
}

const assignRiderSchema = z.object({
  riderId: z.string().min(1, "Please select a rider"),
});

type AssignRiderFormData = z.infer<typeof assignRiderSchema>;

export default function AssignRiderModal({
  isOpen,
  onClose,
  motorcycle,
}: AssignRiderModalProps) {
  const queryClient = useQueryClient();

  // Fetch riders for the dropdown
  const { data: ridersData } = useQuery<RidersResponse>({
    queryKey: ["AllRiders"],
    queryFn: getallRider,
    enabled: isOpen,
  });

  const form = useForm<AssignRiderFormData>({
    resolver: zodResolver(assignRiderSchema),
    defaultValues: {
      riderId: motorcycle?.riderId && typeof motorcycle.riderId === "string" ? motorcycle.riderId : "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const mutation = useMutation({
    mutationFn: ({ motorcycleId, data }: { motorcycleId: string; data: AssignRiderPayload }) =>
      assignRiderToMotorcycle(motorcycleId, data),
    onSuccess: (data) => {
      showToast.success(
        "Rider Assigned Successfully",
        data.message || "Rider assigned successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["AllMotorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["AllTrucks"] });
      reset();
      onClose();
    },
    onError: (error) => {
      showToast.error("Assignment Failed", error.message);
    },
  });

  const onSubmit = async (data: AssignRiderFormData) => {
    if (!motorcycle) return;
    
    await mutation.mutateAsync({
      motorcycleId: motorcycle._id,
      data: { riderId: data.riderId },
    });
  };

  // Update form when motorcycle changes
  useEffect(() => {
    if (motorcycle) {
      reset({
        riderId: motorcycle.riderId && typeof motorcycle.riderId === "string" ? motorcycle.riderId : "",
      });
    }
  }, [motorcycle, reset]);

  if (!isOpen || !motorcycle) return null;

  return (
    <>
      <div
        className="fixed inset-0 min-h-screen bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl py-0 pb-4">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-start justify-between py-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">Assign Rider</CardTitle>
              <CardDescription className="text-slate-300">
                Assign a rider to motorcycle: {motorcycle.licensePlate}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="riderId">Select Rider *</Label>
                <Controller
                  name="riderId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a rider" />
                      </SelectTrigger>
                      <SelectContent>
                        {ridersData?.riders.map((rider) => (
                          <SelectItem key={rider._id} value={rider._id}>
                            {rider.userId?.name || rider.userId?.email || rider._id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.riderId && (
                  <p className="text-sm text-red-500">{errors.riderId.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
              >
                {mutation.isPending ? "Assigning..." : "Assign Rider"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
