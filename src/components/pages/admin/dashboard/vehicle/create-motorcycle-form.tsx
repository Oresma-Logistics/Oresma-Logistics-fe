"use client";

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
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerInput } from "@/components/utility/form/customInput";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateMotorcyclePayload } from "@/_lib/type/motorcycle/motorcycle";
import { CreateMotorcycle } from "@/_lib/api/admin/motorcycle/create-motorcycle";
import { showToast } from "@/components/shared/toast";
import { getallRider } from "@/_lib/api/admin/users/user";
import { RidersResponse } from "@/_lib/type/auth/users";

interface CreateMotorcycleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const motorcycleSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  riderId: z.string().optional(),
  make: z.string().optional(),
  vehicleModel: z.string().optional(),
  year: z.coerce.number().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  engineSize: z.coerce.number().optional(),
  transmissionType: z.string().optional(),
});

type MotorcycleFormData = z.infer<typeof motorcycleSchema>;

export default function CreateMotorcycleModal({
  isOpen,
  onClose,
}: CreateMotorcycleModalProps) {
  const queryClient = useQueryClient();

  // Fetch riders for the optional riderId dropdown
  const { data: ridersData } = useQuery<RidersResponse>({
    queryKey: ["AllRiders"],
    queryFn: getallRider,
    enabled: isOpen, // Only fetch when modal is open
  });

  const form = useForm<MotorcycleFormData>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      licensePlate: "",
      riderId: undefined,
      make: "",
      vehicleModel: "",
      year: undefined,
      color: "",
      fuelType: undefined,
      engineSize: undefined,
      transmissionType: undefined,
    },
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = form;

  const mutation = useMutation({
    mutationFn: CreateMotorcycle,
    onSuccess: (data) => {
      showToast.success(
        "Motorcycle Created Successfully",
        data.message || "Motorcycle created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["AllMotorcycles"] });
      queryClient.invalidateQueries({ queryKey: ["AllTrucks"] });
      reset();
      onClose();
    },
    onError: (error) => {
      showToast.error("Creation Failed", error.message);
    },
  });

  const onSubmit: SubmitHandler<MotorcycleFormData> = async (data) => {
    // Only include fields that have values
    const payload: CreateMotorcyclePayload = {
      licensePlate: data.licensePlate,
    };

    if (data.riderId) payload.riderId = data.riderId;
    if (data.make) payload.make = data.make;
    if (data.vehicleModel) payload.vehicleModel = data.vehicleModel;
    if (data.year) payload.year = data.year;
    if (data.color) payload.color = data.color;
    if (data.fuelType) payload.fuelType = data.fuelType;
    if (data.engineSize) payload.engineSize = data.engineSize;
    if (data.transmissionType) payload.transmissionType = data.transmissionType;

    await mutation.mutateAsync(payload);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 min-h-screen bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl py-0 pb-4">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-start justify-between py-4 sticky top-0 z-10">
            <div className="flex-1">
              <CardTitle className="text-2xl">Create Motorcycle</CardTitle>
              <CardDescription className="text-slate-300">
                Add a new motorcycle to the fleet
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
              {/* License Plate - Required */}
              <CustomerInput
                inputname="licensePlate"
                register={register}
                type="text"
                label="License Plate *"
                placeholder="ABC123"
                error={errors.licensePlate ? errors.licensePlate.message : undefined}
              />

              {/* Rider ID - Optional */}
              <div className="space-y-2">
                <Label htmlFor="riderId">Rider (Optional)</Label>
                <Controller
                  name="riderId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a rider (optional)" />
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
              </div>

              {/* Make - Optional */}
              <CustomerInput
                inputname="make"
                register={register}
                type="text"
                label="Make (Optional)"
                placeholder="Honda"
                error={errors.make ? errors.make.message : undefined}
              />

              {/* Vehicle Model - Optional */}
              <CustomerInput
                inputname="vehicleModel"
                register={register}
                type="text"
                label="Vehicle Model (Optional)"
                placeholder="CBR"
                error={errors.vehicleModel ? errors.vehicleModel.message : undefined}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year - Optional */}
                <CustomerInput
                  inputname="year"
                  register={register}
                  type="number"
                  label="Year (Optional)"
                  placeholder="2020"
                  error={errors.year ? errors.year.message : undefined}
                />

                {/* Color - Optional */}
                <CustomerInput
                  inputname="color"
                  register={register}
                  type="text"
                  label="Color (Optional)"
                  placeholder="Red"
                  error={errors.color ? errors.color.message : undefined}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fuel Type - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type (Optional)</Label>
                  <Controller
                    name="fuelType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Transmission Type - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="transmissionType">Transmission Type (Optional)</Label>
                  <Controller
                    name="transmissionType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Engine Size - Optional */}
              <CustomerInput
                inputname="engineSize"
                register={register}
                type="number"
                label="Engine Size (cc) (Optional)"
                placeholder="600"
                error={errors.engineSize ? errors.engineSize.message : undefined}
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full text-white py-3 font-medium rounded-lg transition-colors cursor-pointer"
              >
                {mutation.isPending
                  ? "Creating Motorcycle..."
                  : "Create Motorcycle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
